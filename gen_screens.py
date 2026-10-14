# Makes placeholder app screens. Replace the SVGs in website/assets/screens with real screenshots.
import os
out=os.path.join(os.path.dirname(__file__),'website/assets/screens')
P={'tourist-guide':('#7C3AED','#10B981',['Discover places','Plan your trip','Pick a language']),
   'nexus':('#10B981','#7C3AED',['Chats','Conversation','Groups']),
   'orvix':('#A78BFA','#10B981',['Models','Local API','Request log'])}
for name,(a,b,titles) in P.items():
  for i,t in enumerate(titles):
    s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 740"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="#0F172A"/></linearGradient></defs><rect width="360" height="740" fill="#F8F7FF"/><rect width="360" height="190" fill="url(#g)"/><circle cx="300" cy="60" r="34" fill="{b}" opacity=".85"/><text x="24" y="120" font-family="Poppins,Arial" font-size="26" font-weight="700" fill="#fff">{t}</text><text x="24" y="148" font-family="Poppins,Arial" font-size="13" fill="#fff" opacity=".8">Placeholder screen - replace me</text>'
    for r in range(4):
      y=216+r*118; w=312-((r+i)%3)*60
      s+=f'<rect x="24" y="{y}" width="312" height="100" rx="18" fill="#fff"/><rect x="38" y="{y+14}" width="72" height="72" rx="14" fill="{a if r%2==0 else b}" opacity=".85"/><rect x="124" y="{y+22}" width="{w-110}" height="12" rx="6" fill="#0F172A" opacity=".85"/><rect x="124" y="{y+46}" width="{max(60,w-150)}" height="9" rx="5" fill="#94A3B8"/><rect x="124" y="{y+64}" width="56" height="16" rx="8" fill="{b}" opacity=".35"/>'
    s+=f'<rect x="120" y="722" width="120" height="5" rx="3" fill="#0F172A" opacity=".5"/></svg>'
    open(f'{out}/{name}-{i+1}.svg','w').write(s)
