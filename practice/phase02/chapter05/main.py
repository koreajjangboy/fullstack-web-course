from db import fetch_members

members = fetch_members()
for member in members:
    print(member)