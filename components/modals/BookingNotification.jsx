"use client";
import { useEffect, useRef } from "react";

const palette = {
  navy: "#1f2557",
  navySoft: "#445065",
  red: "#ea3c3c",
  redDark: "#cf3434",
  success: "#2f7d4a",
  surfaceSoft: "#f8fafc",
  border: "#e7ebf3",
  borderStrong: "#dbe3ee",
  textMuted: "#7b8497",
};

const KEYFRAMES = `
@keyframes bnSlideUp {
  from { opacity:0; transform:translateY(24px) scale(.97); }
  to   { opacity:1; transform:translateY(0)    scale(1);   }
}
@keyframes bnScaleIn {
  0%   { opacity:0; transform:scale(.5);  }
  65%  {            transform:scale(1.08);}
  100% { opacity:1; transform:scale(1);   }
}
@keyframes bnPulse {
  0%   { transform:scale(1);   opacity:.55; }
  100% { transform:scale(1.7); opacity:0;   }
}
@keyframes bnCheck {
  from { stroke-dashoffset:72; }
  to   { stroke-dashoffset:0;  }
}
@keyframes bnXLine {
  from { stroke-dashoffset:24; }
  to   { stroke-dashoffset:0;  }
}
@keyframes bnShake {
  0%,100%{transform:rotate(0deg);}
  20%{transform:rotate(-14deg);}
  40%{transform:rotate(14deg);}
  60%{transform:rotate(-9deg);}
  80%{transform:rotate(9deg);}
}
@keyframes bnBar {
  from{transform:scaleX(0);}
  to  {transform:scaleX(1);}
}
@keyframes bnC0{0%{transform:translate(0,0) rotate(0deg);opacity:1}100%{transform:translate(-44px,72px) rotate(420deg);opacity:0}}
@keyframes bnC1{0%{transform:translate(0,0) rotate(0deg);opacity:1}100%{transform:translate(32px,84px)  rotate(-320deg);opacity:0}}
@keyframes bnC2{0%{transform:translate(0,0) rotate(0deg);opacity:1}100%{transform:translate(-18px,60px) rotate(500deg);opacity:0}}
@keyframes bnC3{0%{transform:translate(0,0) rotate(0deg);opacity:1}100%{transform:translate(52px,78px)  rotate(-460deg);opacity:0}}
@keyframes bnC4{0%{transform:translate(0,0) rotate(0deg);opacity:1}100%{transform:translate(-62px,68px) rotate(360deg);opacity:0}}
@keyframes bnC5{0%{transform:translate(0,0) rotate(0deg);opacity:1}100%{transform:translate(48px,92px)  rotate(-260deg);opacity:0}}
.bn-btn-primary:hover{opacity:.88;transform:translateY(-1px);}
.bn-btn-ghost:hover{background:rgba(31,37,87,.07)!important;}
`;

const CONFETTI = [
  { color:"#ffd700", size:7, top:-4, left:10,  delay:"0.55s", round:true,  anim:0 },
  { color:palette.red,    size:6, top:-6, left:52,  delay:"0.60s", round:false, anim:1 },
  { color:palette.navy,   size:8, top:-2, left:74,  delay:"0.50s", round:true,  anim:2 },
  { color:"#06b6d4",      size:5, top:10, left:-6,  delay:"0.65s", round:false, anim:3 },
  { color:"#f97316",      size:7, top:-8, left:34,  delay:"0.58s", round:true,  anim:4 },
  { color:palette.success,size:6, top: 6, left:82,  delay:"0.70s", round:false, anim:5 },
  { color:"#a855f7",      size:5, top:-4, left:-14, delay:"0.62s", round:true,  anim:3 },
  { color:"#ffd700",      size:6, top:12, left:92,  delay:"0.53s", round:false, anim:2 },
];

function formatDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

export default function BookingNotification({ type, bookingData, tourData, pricing, customerEmail, onClose, onRetry }) {
  const styleRef = useRef(null);
  const isSuccess = type === "success";

  useEffect(() => {
    if (styleRef.current) return;
    const el = document.createElement("style");
    el.textContent = KEYFRAMES;
    el.setAttribute("data-bn", "1");
    document.head.appendChild(el);
    styleRef.current = el;
    return () => { el.remove(); styleRef.current = null; };
  }, []);

  const rows = isSuccess ? [
    { label: "Tour",      value: tourData?.title },
    { label: "Trip Type", value: bookingData?.tripType === "round-trip" ? "Round Trip" : "One Way" },
    { label: "Pick Up",   value: formatDate(bookingData?.selectedDate) },
    ...(bookingData?.tripType === "round-trip" && bookingData?.returnDate
      ? [{ label: "Return", value: formatDate(bookingData.returnDate) }]
      : []),
    { label: "Time",       value: bookingData?.selectedTime },
    { label: "Total Paid", value: pricing?.totalAmount != null ? `$${Number(pricing.totalAmount).toFixed(2)} USD` : null, bold: true },
  ].filter(r => r.value) : [];

  const accent = isSuccess
    ? "linear-gradient(90deg,#2f7d4a,#4ade80)"
    : "linear-gradient(90deg,#ea3c3c,#f87171)";

  const iconBg = isSuccess
    ? "radial-gradient(circle,rgba(47,125,74,.14) 0%,rgba(47,125,74,.05) 100%)"
    : "radial-gradient(circle,rgba(234,60,60,.13) 0%,rgba(234,60,60,.05) 100%)";

  const iconBorder = isSuccess ? "rgba(47,125,74,.28)" : "rgba(234,60,60,.24)";
  const ringColor  = isSuccess ? palette.success : palette.red;

  return (
    <div style={{ animation:"bnSlideUp .42s cubic-bezier(.22,1,.36,1) both", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"8px 4px 12px", gap:22 }}>

      {/* accent bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, borderRadius:"28px 28px 0 0", background:accent, transformOrigin:"left", animation:"bnBar .55s cubic-bezier(.22,1,.36,1) .08s both" }} />

      {/* icon */}
      <div style={{ position:"relative", marginTop:16 }}>
        {[0,1].map(i => (
          <div key={i} style={{ position:"absolute", inset:-2, borderRadius:"50%", border:`2px solid ${ringColor}`, animation:`bnPulse 2s ease-out ${i*0.7}s infinite`, opacity:0 }} />
        ))}

        <div style={{ width:92, height:92, borderRadius:"50%", background:iconBg, border:`2px solid ${iconBorder}`, display:"flex", alignItems:"center", justifyContent:"center", animation:"bnScaleIn .52s cubic-bezier(.34,1.56,.64,1) .1s both" }}>
          {isSuccess ? (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <polyline points="9,23 19,33 35,13" stroke={palette.success} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="72" strokeDashoffset="72" style={{ animation:"bnCheck .48s ease-out .48s forwards" }} />
            </svg>
          ) : (
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" style={{ animation:"bnShake .48s ease-out .3s both" }}>
              <line x1="11" y1="11" x2="27" y2="27" stroke={palette.red} strokeWidth="3.8" strokeLinecap="round" strokeDasharray="24" strokeDashoffset="24" style={{ animation:"bnXLine .26s ease-out .3s forwards" }} />
              <line x1="27" y1="11" x2="11" y2="27" stroke={palette.red} strokeWidth="3.8" strokeLinecap="round" strokeDasharray="24" strokeDashoffset="24" style={{ animation:"bnXLine .26s ease-out .46s forwards" }} />
            </svg>
          )}
        </div>

        {isSuccess && CONFETTI.map((c, i) => (
          <div key={i} style={{ position:"absolute", width:c.size, height:c.size, borderRadius:c.round?"50%":"2px", background:c.color, top:c.top, left:c.left, opacity:0, animation:`bnC${c.anim} .9s ease-out ${c.delay} forwards` }} />
        ))}
      </div>

      {/* text */}
      <div style={{ maxWidth:380 }}>
        <h3 style={{ fontSize:24, fontWeight:800, color:palette.navy, margin:"0 0 8px", letterSpacing:"-0.4px", lineHeight:1.2 }}>
          {isSuccess ? "Booking Confirmed!" : "Booking Failed"}
        </h3>
        <p style={{ fontSize:14, color:palette.textMuted, margin:0, lineHeight:1.55 }}>
          {isSuccess
            ? "Your Jamaica tour is booked and payment has been received."
            : "There was an issue processing your booking. Please check your details and try again."}
        </p>
      </div>

      {/* details card */}
      {isSuccess && rows.length > 0 && (
        <div style={{ width:"100%", background:palette.surfaceSoft, border:`1px solid ${palette.border}`, borderRadius:16, padding:"4px 20px 12px", textAlign:"left" }}>
          {rows.map(({ label, value, bold }) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${palette.border}` }}>
              <span style={{ fontSize:13, color:palette.textMuted, flexShrink:0 }}>{label}</span>
              <span style={{ fontSize:13, fontWeight:bold?700:500, color:bold?palette.success:palette.navy, textAlign:"right", marginLeft:12 }}>{value}</span>
            </div>
          ))}
          {customerEmail && (
            <p style={{ fontSize:12, color:palette.textMuted, margin:"10px 0 0", textAlign:"center" }}>
              Confirmation sent to <strong style={{ color:palette.navySoft }}>{customerEmail}</strong>
            </p>
          )}
        </div>
      )}

      {/* buttons */}
      <div style={{ display:"flex", gap:12, width:"100%", marginTop:2 }}>
        {isSuccess ? (
          <button className="bn-btn-primary" onClick={onClose} style={{ flex:1, padding:14, background:`linear-gradient(135deg,${palette.navy} 0%,#2d3a8c 100%)`, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 10px 28px rgba(31,37,87,.22)", transition:"opacity .18s,transform .18s" }}>
            Done
          </button>
        ) : (
          <>
            <button className="bn-btn-primary" onClick={onRetry} style={{ flex:1, padding:14, background:`linear-gradient(135deg,${palette.red} 0%,${palette.redDark} 100%)`, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 10px 28px rgba(234,60,60,.24)", transition:"opacity .18s,transform .18s" }}>
              Try Again
            </button>
            <button className="bn-btn-ghost" onClick={onClose} style={{ flex:1, padding:14, background:"transparent", color:palette.navySoft, border:`1.5px solid ${palette.borderStrong}`, borderRadius:13, fontSize:15, fontWeight:500, cursor:"pointer", transition:"background .18s" }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
