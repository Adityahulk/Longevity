#!/usr/bin/env python3
"""
Outreach pipeline tracker for Antiaging Labs founding-cohort outreach.

One CSV is the single source of truth for who's been contacted, where they are in the
pipeline, and what to do next. This script avoids hand-formatting CSV every session and
keeps the columns/status values consistent so "where am I" and "who do I follow up with"
stay answerable.

Usage:
  # create the file (no-op if it already exists)
  python tracker.py init [--path outreach/pipeline.csv]

  # add or update a person (matched case-insensitively by name); only given fields change
  python tracker.py add  --name "Priya Nair" --channel linkedin --segment professional \
      --contact "linkedin.com/in/priyanair" --status contacted \
      --next "await reply, follow up in 3d" --notes "runs ultras; liked bio-age post"
  python tracker.py update --name "Priya Nair" --status consult_booked --next "call Thu 5pm"

  # read state
  python tracker.py list [--status replied]
  python tracker.py followups          # rows whose next_action is due/!= done, not closed
  python tracker.py stats              # counts by status + reply/booking rates

Status pipeline: to_contact -> contacted -> replied -> consult_booked -> consult_done -> member
                 plus 'passed' (not a fit / declined).
"""
import argparse, csv, os, sys
from datetime import date

COLUMNS = ["name", "channel", "segment", "profile_or_contact",
           "status", "last_contacted", "next_action", "notes"]
STATUSES = ["to_contact", "contacted", "replied", "consult_booked",
            "no_show", "consult_done", "member", "passed"]
CLOSED = {"member", "passed"}
DEFAULT_PATH = "outreach/pipeline.csv"


def load(path):
    if not os.path.exists(path):
        return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def save(path, rows):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        for r in rows:
            w.writerow({c: r.get(c, "") for c in COLUMNS})


def find(rows, name):
    nl = name.strip().lower()
    for r in rows:
        if r.get("name", "").strip().lower() == nl:
            return r
    return None


def cmd_init(a):
    if os.path.exists(a.path):
        print(f"exists: {a.path} ({len(load(a.path))} rows)")
        return
    save(a.path, [])
    print(f"created: {a.path}")


def cmd_add(a):
    rows = load(a.path)
    if a.status and a.status not in STATUSES:
        sys.exit(f"invalid status '{a.status}'. valid: {', '.join(STATUSES)}")
    row = find(rows, a.name)
    new = row is None
    if new:
        row = {c: "" for c in COLUMNS}
        row["name"] = a.name.strip()
        row["status"] = "to_contact"
        rows.append(row)
    for field, val in [("channel", a.channel), ("segment", a.segment),
                       ("profile_or_contact", a.contact), ("status", a.status),
                       ("next_action", a.next), ("notes", a.notes)]:
        if val is not None:
            row[field] = val
    # stamp last_contacted when we move into/through an outbound state
    if a.status in {"contacted", "consult_booked", "consult_done"} or \
       (new and row["status"] == "contacted"):
        row["last_contacted"] = a.date or str(date.today())
    if a.date:
        row["last_contacted"] = a.date
    save(a.path, rows)
    print(f"{'added' if new else 'updated'}: {row['name']} -> {row['status']}")


def cmd_list(a):
    rows = load(a.path)
    if a.status:
        rows = [r for r in rows if r.get("status") == a.status]
    if not rows:
        print("(no rows)")
        return
    for r in rows:
        print(f"- {r['name']:<22} {r.get('status',''):<14} {r.get('channel',''):<10} "
              f"next: {r.get('next_action','')}")


def cmd_followups(a):
    rows = [r for r in load(a.path)
            if r.get("status") not in CLOSED
            and r.get("status") not in ("", "member")
            and (r.get("next_action") or "").strip().lower() not in ("", "done")]
    if not rows:
        print("(nothing pending)")
        return
    order = {s: i for i, s in enumerate(STATUSES)}
    rows.sort(key=lambda r: order.get(r.get("status"), 99))
    for r in rows:
        print(f"- {r['name']:<22} [{r.get('status','')}] last: {r.get('last_contacted','-')}  "
              f"-> {r.get('next_action','')}")


def cmd_stats(a):
    rows = load(a.path)
    if not rows:
        print("(empty)")
        return
    counts = {s: 0 for s in STATUSES}
    for r in rows:
        counts[r.get("status", "")] = counts.get(r.get("status", ""), 0) + 1
    total = len(rows)
    contacted = sum(counts.get(s, 0) for s in
                    ["contacted", "replied", "consult_booked", "no_show",
                     "consult_done", "member", "passed"])
    replied = sum(counts.get(s, 0) for s in
                  ["replied", "consult_booked", "no_show", "consult_done", "member"])
    booked = sum(counts.get(s, 0) for s in
                 ["consult_booked", "no_show", "consult_done", "member"])
    converted = counts.get("member", 0)
    done = sum(counts.get(s, 0) for s in ["consult_done", "member"])
    print(f"total in pipeline: {total}")
    for s in STATUSES:
        if counts.get(s):
            print(f"  {s:<14} {counts[s]}")
    if contacted:
        print(f"reply rate:   {replied}/{contacted} = {replied/contacted:.0%}")
        print(f"booking rate: {booked}/{contacted} = {booked/contacted:.0%} (of contacted)")
    if booked:
        print(f"show rate:    {done}/{booked} = {done/booked:.0%} (of booked; rest no-showed)")
    if done:
        print(f"close rate:   {converted}/{done} = {converted/done:.0%} (members / completed calls)")
    print(f"consults booked+: {booked}   |   members: {converted}   |   goal: 15")


def main():
    # --path is shared by every subcommand and accepted on either side of it,
    # e.g. both `tracker.py --path X init` and `tracker.py init --path X` work.
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--path", default=DEFAULT_PATH, help=f"CSV path (default {DEFAULT_PATH})")

    p = argparse.ArgumentParser(description="Antiaging Labs outreach pipeline tracker",
                                parents=[common])
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("init", parents=[common])

    for name in ("add", "update"):
        sp = sub.add_parser(name, parents=[common])
        sp.add_argument("--name", required=True)
        sp.add_argument("--channel")
        sp.add_argument("--segment")
        sp.add_argument("--contact")
        sp.add_argument("--status")
        sp.add_argument("--next", dest="next")
        sp.add_argument("--notes")
        sp.add_argument("--date", help="override last_contacted (YYYY-MM-DD)")

    lp = sub.add_parser("list", parents=[common])
    lp.add_argument("--status")

    sub.add_parser("followups", parents=[common])
    sub.add_parser("stats", parents=[common])

    a = p.parse_args()
    {"init": cmd_init, "add": cmd_add, "update": cmd_add,
     "list": cmd_list, "followups": cmd_followups, "stats": cmd_stats}[a.cmd](a)


if __name__ == "__main__":
    main()
