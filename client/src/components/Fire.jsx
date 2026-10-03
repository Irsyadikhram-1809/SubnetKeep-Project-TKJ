export function Fire({ small }) {
  if (small) return (
    <div className="fire s" aria-hidden="true">
      <i style={{ '--x': '-8px', '--h': '22px', '--d': '.7s' }} />
      <i style={{ '--x': '0px',  '--h': '36px', '--d': '.9s' }} />
      <i style={{ '--x': '8px',  '--h': '22px', '--d': '.8s' }} />
    </div>
  );
  return (
    <div className="fire" aria-hidden="true">
      <i style={{ '--x': '-44px', '--h': '50px', '--d': '.8s'  }} />
      <i style={{ '--x': '-22px', '--h': '72px', '--d': '.6s'  }} />
      <i style={{ '--x': '0px',   '--h': '98px', '--d': '.9s'  }} />
      <i style={{ '--x': '22px',  '--h': '72px', '--d': '.7s'  }} />
      <i style={{ '--x': '44px',  '--h': '50px', '--d': '.85s' }} />
    </div>
  );
}
