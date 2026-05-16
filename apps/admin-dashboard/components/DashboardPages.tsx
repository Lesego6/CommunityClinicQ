import React from "react";
import { AdminShell, Icon } from "./AdminShell";

const people = [
  ["Thandi Mokoena", "Professional Nurse", "NUR-1021", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80"],
  ["Nomsa Dlamini", "Enrolled Nurse", "NUR-1045", "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&q=80"],
  ["Lerato Jacobs", "Professional Nurse", "NUR-1077", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80"],
  ["Sipho Khumalo", "Enrolled Nurse", "NUR-1012", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80"],
  ["Zanele Ngcobo", "Professional Nurse", "NUR-1089", "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=120&q=80"],
  ["Palesa Modise", "Enrolled Nurse", "NUR-1103", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&q=80"],
];

const services = [
  ["General Consultation", "5 Staff Assigned", "green"],
  ["Chronic Care", "4 Staff Assigned", "blue"],
  ["Immunization", "3 Staff Assigned", "purple"],
  ["Maternal & Child Health", "3 Staff Assigned", "orange"],
  ["Family Planning", "2 Staff Assigned", "red"],
  ["Minor Treatment", "2 Staff Assigned", "teal"],
];

const stockRows = [
  ["Paracetamol 500mg", "Tablet", "Pain Relief", "1,250", "tabs", "In Stock", "green", "45 days", 78],
  ["Amoxicillin 250mg", "Capsule", "Antibiotic", "120", "caps", "Low Stock", "orange", "3 days", 35],
  ["Salbutamol Inhaler", "100mcg", "Respiratory", "0", "inhalers", "Out of Stock", "red", "0 days", 0],
  ["Metformin 500mg", "Tablet", "Diabetes", "230", "tabs", "Low Stock", "orange", "5 days", 42],
  ["Amlodipine 5mg", "Tablet", "Cardiovascular", "560", "tabs", "In Stock", "green", "25 days", 72],
  ["Ibuprofen 400mg", "Tablet", "Pain Relief", "80", "tabs", "Low Stock", "orange", "2 days", 28],
  ["Ciprofloxacin 500mg", "Tablet", "Antibiotic", "0", "tabs", "Out of Stock", "red", "0 days", 0],
  ["Insulin (Human)", "Injection", "Diabetes", "15", "vials", "Low Stock", "orange", "4 days", 30],
];

export function StaffManagementPage() {
  return (
    <AdminShell active="/staff">
      <section className="page">
        <div className="page-header">
          <div className="page-title">
            <h1>Staff Management</h1>
            <p>Manage staff, assign queues and organize shifts</p>
          </div>
          <button className="button primary">+ Add Staff</button>
        </div>

        <div className="grid stats-grid">
          <Metric title="Active Staff" value="28" note="of 32 total staff" tone="green" />
          <Metric title="On Duty Now" value="18" note="Across all queues" tone="blue" />
          <Metric title="Queues Covered" value="6" note="of 8 total queues" tone="orange" />
          <Metric title="Upcoming Shifts" value="12" note="Next 24 hours" tone="purple" />
        </div>

        <div className="grid two-grid" style={{ marginTop: 22 }}>
          <div className="card">
            <SectionTitle title="Active Nurses" action="View all" />
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Nurse</th><th>Role</th><th>Status</th><th>Current Queue</th><th>Started At</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {people.slice(0, 5).map((p, i) => (
                    <tr key={p[0]}>
                      <td><Person name={p[0]} sub={`ID: ${p[2]}`} img={p[3]} /></td>
                      <td>{p[1]}</td>
                      <td><span className={`pill ${i === 3 ? "orange" : "green"}`}>{i === 3 ? "Break" : "On Duty"}</span></td>
                      <td>{["General Consultation", "Chronic Care", "Immunization", "-", "Maternal & Child Health"][i]}</td>
                      <td>{i === 3 ? "10:30 AM" : i === 2 ? "07:30 AM" : "08:00 AM"}</td>
                      <td>⋮</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: "center", padding: 18 }}><span className="link">View all staff &rarr;</span></div>
          </div>

          <div className="card">
            <SectionTitle title="Queue Assignment" subtitle="Manage which staff are assigned to each queue" action="View all" />
            <div className="queue-list">
              {services.map((s, i) => (
                <div className="queue-row" key={s[0]}>
                  <div className={`icon-box`} style={{ background: `var(--${s[2] === "red" ? "danger" : s[2]}-light, var(--primary-light))` }}>{i + 1}</div>
                  <div>
                    <strong>{s[0]}</strong>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>{s[1]}</div>
                  </div>
                  <AvatarStack count={i < 2 ? 5 : i < 4 ? 4 : 2} extra={i === 0 ? 2 : i === 1 ? 1 : 0} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card card-pad" style={{ marginTop: 22 }}>
          <div className="page-header" style={{ marginBottom: 18 }}>
            <div className="page-title"><h1 style={{ fontSize: 20 }}>Shift Management</h1><p>View and manage staff shifts</p></div>
            <button className="button primary">+ Create Shift</button>
          </div>
          <div className="toolbar" style={{ justifyContent: "space-between", marginBottom: 22 }}>
            <div className="toolbar"><span className="pill green">Daily View</span><span className="pill">Weekly View</span><span className="pill">Monthly View</span></div>
            <strong>24 May 2024<br /><span style={{ color: "var(--muted)", fontSize: 12, fontWeight: 500 }}>Friday</span></strong>
          </div>
          <Schedule />
          <div style={{ textAlign: "center", paddingTop: 20 }}><span className="link">View full schedule &rarr;</span></div>
        </div>

        <div className="grid three-grid" style={{ marginTop: 22 }}>
          <SummaryCard />
          <UpcomingShifts />
          <AlertsCard />
        </div>
      </section>
    </AdminShell>
  );
}

export function QueueAnalyticsPage() {
  return (
    <AdminShell active="/analytics">
      <section className="page">
        <div className="page-header">
          <div className="page-title"><h1>Queue Analytics</h1><p>Monitor and improve patient queue performance</p></div>
          <div className="toolbar"><div className="select-like">20 May - 26 May 2024</div><button className="button primary">Export Report</button></div>
        </div>
        <div className="toolbar" style={{ marginBottom: 22 }}><div className="select-like" style={{ minWidth: 300 }}>Langa Community Clinic</div></div>
        <div className="grid stats-grid">
          <Metric title="Average Wait Time" value="42 min" note="↓ 8 min vs last week" tone="green" />
          <Metric title="Patients Served" value="1,248" note="↑ 6.4% vs last week" tone="blue" />
          <Metric title="Peak Queue Today" value="87 people" note="At 10:00 AM" tone="purple" />
          <Metric title="Queue Completion Rate" value="95%" note="↑ 3% vs last week" tone="green" />
        </div>
        <div className="grid two-grid" style={{ marginTop: 18 }}>
          <ChartCard title="Average Wait Time Over Time"><LineChart /></ChartCard>
          <ChartCard title="Average Wait Time by Service"><DonutLegend /></ChartCard>
          <ChartCard title="Peak Hours" subtitle="Busiest times based on average queue size"><BarChart /></ChartCard>
          <div className="card card-pad"><h2>Queue Performance</h2><div className="gauge" /><div className="gauge-score"><strong style={{ fontSize: 34 }}>82</strong><br /><span>/100</span></div><p style={{ color: "var(--muted)" }}>Queue performance is good this week. Keep up the good work!</p><PerformanceRows /></div>
        </div>
        <ChartCard title="Queue Trends Comparison" wide><TrendChart /></ChartCard>
        <div className="grid three-grid" style={{ marginTop: 18 }}>
          <Insight tone="green" title="Peak Time Insight" text="10:00 AM is consistently the busiest hour. Consider allocating more staff during this time." />
          <Insight tone="orange" title="Wait Time Insight" text="Average wait time has increased slightly on Sundays. Review staffing and resources." />
          <Insight tone="blue" title="Performance Insight" text="Great job! Your queue performance score improved by 5 points." />
        </div>
        <Footer />
      </section>
    </AdminShell>
  );
}

export function MedicationStockPage() {
  return (
    <AdminShell active="/medications">
      <section className="page">
        <div className="page-header">
          <div className="page-title"><h1>Medication Stock Dashboard</h1><p>Monitor inventory, detect low stock and manage restocks</p></div>
          <div className="toolbar"><div className="select-like">Langa Community Clinic</div><div className="select-like">24 May 2024</div></div>
        </div>
        <div className="grid stats-grid">
          <StockMetric title="Low Stock Items" value="12" note="12% of total items" tone="red" />
          <StockMetric title="Out of Stock Items" value="4" note="4% of total items" tone="orange" />
          <StockMetric title="Total Items" value="125" note="Across all categories" tone="green" />
          <StockMetric title="Value of Inventory" value="R 285,430" note="Total current value" tone="blue" />
        </div>
        <div className="grid three-grid" style={{ marginTop: 20 }}>
          <ActionCard title="Restock Alerts" badge="6 new" text="6 medications need immediate restocking." tone="red" action="View Alerts" />
          <ActionCard title="Predicted Shortages" badge="8 items" text="8 medications likely to run out in next 14 days." tone="orange" action="View Predictions" />
          <ActionCard title="All Good" text="No expired medications." tone="green" action="View Expiry Report" />
        </div>
        <div className="tabs">
          {["Current Stock", "Low Stock 12", "Out of Stock 4", "Predicted Shortages 8", "Restock Alerts 6", "Reports"].map((t, i) => <span key={t} className={`tab ${i === 0 ? "active" : ""}`}>{t}</span>)}
        </div>
        <div className="card">
          <div className="section-title">
            <h2>Current Stock Overview</h2>
            <div className="toolbar"><label className="search"><input placeholder="Search medication..." /></label><button className="button">Filter</button></div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Medication</th><th>Category</th><th>Current Stock</th><th>Status</th><th>Days of Stock Left</th><th>Actions</th></tr></thead>
              <tbody>{stockRows.map((r) => <tr key={r[0]}><td><strong>{r[0]}</strong><br /><span style={{ color: "var(--muted)" }}>{r[1]}</span></td><td>{r[2]}</td><td><strong>{r[3]}</strong> <span style={{ color: "var(--muted)" }}>{r[4]}</span></td><td><span className={`pill ${r[6]}`}>{r[5]}</span></td><td>{r[7]}<div className="stock-row-progress"><span style={{ width: `${r[8]}%`, background: r[6] === "red" ? "var(--danger)" : r[6] === "orange" ? "var(--secondary)" : "var(--primary)" }} /></div></td><td>⋮</td></tr>)}</tbody>
            </table>
          </div>
          <div style={{ padding: 16, color: "var(--muted)" }}>Showing 1 to 8 of 125 items</div>
        </div>
        <div className="grid two-grid" style={{ marginTop: 22 }}>
          <PredictedShortages />
          <div className="card card-pad"><SectionTitle title="Stock Status by Category" action="View report" compact /><DonutLegend center="63" /></div>
        </div>
        <RecentRestocks />
        <Footer centered />
      </section>
    </AdminShell>
  );
}

export function NurseScannerPage() {
  return (
    <AdminShell active="/scanner" mode="staff">
      <section className="page">
        <div className="page-header">
          <div className="page-title"><h1>Nurse Quick Scanner</h1><p>Scan patient QR code to check-in and view queue information instantly.</p></div>
          <span className="pill green">Camera is ready</span>
        </div>
        <div className="scanner-layout">
          <div className="scanner-frame">
            <strong style={{ position: "absolute", top: 38 }}>Scan Patient QR Code</strong>
            <div className="qr-corner corner-a" /><div className="qr-corner corner-b" /><div className="qr-corner corner-c" /><div className="qr-corner corner-d" />
            <div className="fake-qr" />
            <div className="scan-line" />
            <button className="button" style={{ position: "absolute", bottom: 32, background: "rgba(17,24,39,.55)", color: "#fff" }}>Turn on Flash</button>
          </div>
          <div className="card card-pad">
            <h2>How it works</h2>
            {[["1", "Ask the patient for their queue QR code"], ["2", "Scan the QR code using the camera"], ["3", "Review patient & queue info"], ["4", "Tap Check-in to confirm instantly"]].map((s) => (
              <div className="queue-row" style={{ border: 0, paddingLeft: 0 }} key={s[0]}><span className="icon-box" style={{ borderRadius: 99 }}>{s[0]}</span><span>{s[1]}</span></div>
            ))}
            <div className="queue-row tint-green" style={{ marginTop: 18 }}>Tip: Ensure good lighting and hold the camera steady for best results.</div>
          </div>
        </div>
        <LastScanned />
        <CheckinsTable />
        <div className="grid stats-grid" style={{ marginTop: 22 }}>
          <Metric title="Today's Check-ins" value="24" note="↑ 12% vs yesterday" tone="green" />
          <Metric title="Average Check-in Time" value="6 sec" note="Fast check-in" tone="blue" />
          <Metric title="Queue Accuracy" value="98%" note="Excellent" tone="orange" />
          <Metric title="Scans Today" value="28" note="QR scans" tone="purple" />
        </div>
      </section>
    </AdminShell>
  );
}

export function PlaceholderPage({ title, active }: { title: string; active: string }) {
  return (
    <AdminShell active={active}>
      <section className="page">
        <div className="page-header"><div className="page-title"><h1>{title}</h1><p>ClinicQ operational dashboard</p></div></div>
        <div className="grid stats-grid">
          <Metric title="Open Tasks" value="18" note="Needs review" tone="green" />
          <Metric title="Today" value="42" note="Records updated" tone="blue" />
          <Metric title="Alerts" value="6" note="Priority items" tone="orange" />
          <Metric title="Completion" value="95%" note="On track" tone="purple" />
        </div>
        <div className="card card-pad" style={{ marginTop: 22 }}><h2>{title}</h2><p style={{ color: "var(--muted)" }}>This page is ready for the next set of detailed screens. The navigation has been trimmed to only the sections shown in the supplied designs.</p></div>
      </section>
    </AdminShell>
  );
}

function Metric({ title, value, note, tone }: { title: string; value: string; note: string; tone: string }) {
  return <div className={`metric card tint-${tone}`}><div className="metric-top"><span>{title}</span><span className={`icon-box`}>{title[0]}</span></div><div className="value">{value}</div><p>{note}</p></div>;
}

function StockMetric(props: { title: string; value: string; note: string; tone: string }) {
  return <div className={`metric card tint-${props.tone === "red" ? "orange" : props.tone}`}><div className="metric-top" style={{ color: `var(--${props.tone === "red" ? "danger" : props.tone})` }}><span>{props.title}</span></div><div className="value">{props.value}</div><p>{props.note}</p><Spark tone={props.tone} /></div>;
}

function SectionTitle({ title, subtitle, action, compact }: { title: string; subtitle?: string; action?: string; compact?: boolean }) {
  return <div className="section-title" style={compact ? { padding: 0, marginBottom: 14 } : undefined}><div><h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div>{action ? <span className="link">{action}</span> : null}</div>;
}

function Person({ name, sub, img }: { name: string; sub: string; img: string }) {
  return <div className="person"><img className="small-avatar" src={img} alt="" /><div><strong>{name}</strong><span>{sub}</span></div></div>;
}

function AvatarStack({ count, extra }: { count: number; extra: number }) {
  return <div className="avatar-stack">{people.slice(0, count).map((p) => <img key={p[0]} src={p[3]} alt="" />)}{extra ? <span>+{extra}</span> : null}</div>;
}

function Schedule() {
  return (
    <div className="schedule-grid">
      <div className="schedule-cell"><strong>Staff</strong></div>
      {["07:00 - 15:00 Morning Shift", "15:00 - 23:00 Afternoon Shift", "23:00 - 07:00 Night Shift"].map((h) => (
        <div className="schedule-cell" key={h}><strong>{h}</strong></div>
      ))}
      {people.map((p, i) => (
        <React.Fragment key={`${p[0]}-schedule`}>
          <div className="schedule-cell"><Person name={p[0]} sub={`${p[1]} ID: ${p[2]}`} img={p[3]} /></div>
          <div className="schedule-cell"><Shift label={["General Consultation", "", "Immunization", "", "", "Family Planning"][i]} /></div>
          <div className="schedule-cell"><Shift label={["", "Chronic Care", "", "", "Maternal & Child Health", ""][i]} tone="orange" /></div>
          <div className="schedule-cell"><Shift label={["", "", "", "Minor Treatment", "", ""][i]} tone="purple" /></div>
        </React.Fragment>
      ))}
    </div>
  );
}

function Shift({ label, tone }: { label?: string; tone?: string }) {
  return label ? <div className={`shift-block ${tone ?? ""}`}>{label}<br /><span style={{ fontWeight: 500 }}>07:00 - 15:00</span></div> : <div style={{ textAlign: "center", color: "var(--muted)", paddingTop: 18 }}>-</div>;
}

function SummaryCard() { return <div className="card card-pad"><h2>Today's Summary</h2>{["Total Staff On Duty 18", "Total Staff Off Duty 10", "On Break 3", "Absent 1", "Queues Fully Covered 6 / 8"].map((s) => <p key={s} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>{s}</p>)}<button className="button" style={{ width: "100%" }}>View Attendance Report</button></div>; }
function UpcomingShifts() { return <div className="card card-pad"><SectionTitle title="Upcoming Shifts" action="View all" compact />{["Morning Shift 12 Staff", "Afternoon Shift 9 Staff", "Night Shift 6 Staff"].map((s) => <div className="queue-row" key={s}><span className="icon-box">25</span><strong>{s}</strong></div>)}</div>; }
function AlertsCard() { return <div className="card card-pad"><h2>Alerts</h2><ActionCard title="Short Staff" text="Minor Treatment queue has only 1 staff assigned" tone="red" action="View Queue" /><ActionCard title="Shift Overlap" text="2 staff have overlapping shifts today" tone="orange" action="View Details" /><ActionCard title="Unassigned Queue" text="TB Screening queue has no staff assigned" tone="blue" action="Assign Staff" /></div>; }

function ChartCard({ title, subtitle, children, wide }: { title: string; subtitle?: string; children: React.ReactNode; wide?: boolean }) {
  return <div className="card card-pad chart-card" style={wide ? { marginTop: 18 } : undefined}><SectionTitle title={title} subtitle={subtitle} compact />{children}</div>;
}

function LineChart() { return <svg className="line-chart" viewBox="0 0 640 250"><GridLines />{[48,50,45,40,38,35,42].map((v,i)=><text key={i} x={60+i*88} y={180-v*2.1} fontSize="14" fontWeight="800">{v}</text>)}<polyline points="60,120 148,112 236,122 324,138 412,144 500,154 588,132" fill="none" stroke="#1b6b3a" strokeWidth="4"/><polygon points="60,120 148,112 236,122 324,138 412,144 500,154 588,132 588,220 60,220" fill="rgba(27,107,58,.10)"/></svg>; }
function TrendChart() { return <svg className="trend-chart" viewBox="0 0 980 250"><GridLines wide />{["#1b6b3a","#2563eb","#7c3aed"].map((c,i)=><polyline key={c} points={`40,${160-i*35} 140,${150-i*38} 240,${152-i*42} 340,${145-i*38} 440,${150-i*45} 540,${146-i*52} 640,${148-i*44} 740,${160-i*40} 840,${170-i*35} 940,${182-i*42}`} fill="none" stroke={c} strokeWidth="4"/>)}</svg>; }
function BarChart() { return <svg className="bar-chart" viewBox="0 0 640 250">{[12,28,62,87,75,60,45,30,18,10].map((v,i)=><g key={i}><rect x={32+i*58} y={220-v*2} width="22" height={v*2} rx="6" fill={i===3?"#e8821a":"#22c55e"}/><text x={30+i*58} y={210-v*2} fontSize="13" fontWeight="800">{v}</text><text x={20+i*58} y={240} fontSize="12">{`${7+i}:00`}</text></g>)}</svg>; }
function GridLines({ wide }: { wide?: boolean }) { return <>{[50,90,130,170,210].map((y)=><line key={y} x1="40" y1={y} x2={wide ? "950" : "620"} y2={y} stroke="#e5e7eb"/> )}</>; }
function DonutLegend({ center }: { center?: string }) { return <div className="donut-wrap"><div className="donut" />{center ? <strong style={{ marginLeft: -122, zIndex: 1, fontSize: 30 }}>{center}</strong> : null}<div className="legend">{["General Consultation 42 min","Chronic Care 35 min","Maternal & Child Health 40 min","Immunization 20 min","Other Services 30 min"].map((l,i)=><div className="legend-item" key={l}><span className="dot" style={{background:["#1b6b3a","#2563eb","#7c3aed","#e8821a","#d1d5db"][i]}} />{l}</div>)}</div></div>; }
function PerformanceRows() { return <div className="legend">{["Patients Left Without Being Seen 5% ↓ 2%","Average Service Time 12 min ↓ 1 min","Patient Satisfaction 4.6 / 5 ↑ 0.2"].map((r)=><div className="legend-item" key={r}><Icon name="people" />{r}</div>)}</div>; }
function Insight({ tone, title, text }: { tone: string; title: string; text: string }) { return <div className={`card card-pad tint-${tone}`}><h3>{title}</h3><p>{text}</p></div>; }
function Spark({ tone }: { tone: string }) { return <svg className="spark" viewBox="0 0 180 42"><polyline points="0,28 20,20 38,25 56,16 74,30 92,22 110,26 128,14 146,23 164,10 180,18" fill="none" stroke={`var(--${tone === "red" ? "danger" : tone})`} strokeWidth="3"/></svg>; }
function ActionCard({ title, text, tone, action, badge }: { title: string; text: string; tone: string; action: string; badge?: string }) { return <div className={`card card-pad tint-${tone === "red" ? "orange" : tone}`}><div style={{ display: "flex", justifyContent: "space-between" }}><h3>{title}</h3>{badge ? <span className={`pill ${tone === "red" ? "red" : tone}`}>{badge}</span> : null}</div><p>{text}</p><span className="link">{action} &rarr;</span></div>; }
function PredictedShortages() { return <div className="card"><SectionTitle title="Predicted Shortages (Next 14 Days)" action="View all" /><table className="table"><tbody>{stockRows.slice(1,5).map((r,i)=><tr key={r[0]}><td><strong>{r[0]}</strong><br/><span style={{color:"var(--muted)"}}>{r[1]}</span></td><td>{["27 May 2024","26 May 2024","28 May 2024","02 Jun 2024"][i]}</td><td><span className={`pill ${i===3?"orange":"red"}`}>{[3,2,4,9][i]} days</span></td><td><button className="button">Order Now</button></td></tr>)}</tbody></table></div>; }
function RecentRestocks() { return <div className="card" style={{ marginTop: 22 }}><SectionTitle title="Recent Restock Alerts" action="View all alerts" /><table className="table"><tbody>{["Amoxicillin 250mg is low on stock","Salbutamol Inhaler is out of stock","Ciprofloxacin 500mg is out of stock"].map((r,i)=><tr key={r}><td><span className="pill red">!</span></td><td><strong>{r}</strong><br/><span style={{color:"var(--muted)"}}>Current stock: {i===0?"120 caps":"0 tabs"}</span></td><td>Langa Community Clinic</td><td>{i<2?"Today":"Yesterday"}</td><td><button className="button">Create Order</button></td></tr>)}</tbody></table></div>; }
function LastScanned() { return <div className="card card-pad" style={{ marginTop: 26 }}><SectionTitle title="Last Scanned Patient" action="Checked in at 09:21 AM" compact /><div className="grid" style={{ gridTemplateColumns: "1.1fr .7fr .7fr .7fr", alignItems: "center" }}><Person name="Sipho Khumalo" sub="ID: 900101 5608 085 Phone: 071 234 5678" img={people[3][3]} /><div><span>Queue Number</span><h2 style={{ color: "var(--primary)" }}>A023</h2><span>General Consultation</span></div><div><span>You are</span><h2 style={{ color: "var(--primary)" }}>5th</h2><span>in queue</span></div><div><span>Estimated Wait</span><h2 style={{ color: "var(--secondary)" }}>35 - 45 min</h2><span>Joined 09:15 AM</span></div></div><div className="toolbar" style={{ marginTop: 22 }}><button className="button" style={{ flex: 1 }}>View Full Details &rarr;</button><button className="button primary" style={{ flex: 1 }}>Check-in Patient</button></div></div>; }
function CheckinsTable() { return <div className="card" style={{ marginTop: 24 }}><div className="tabs" style={{ margin: 0, padding: "0 24px" }}><span className="tab active">Today's Check-ins</span><span className="tab">Recent Scans</span><span className="tab">Manual Check-in</span></div><table className="table"><tbody>{people.slice(0,5).map((p,i)=><tr key={p[0]}><td><Person name={p[0]} sub={`ID: ${i}90010 5608 085`} img={p[3]} /></td><td style={{ color:"var(--primary)", fontWeight:900 }}>A0{18+i}</td><td>{["General Consultation","Chronic Care","Immunization","General Consultation","General Consultation"][i]}</td><td>09:{String(5+i*4).padStart(2,"0")} AM</td><td><span className={`pill ${i===4?"blue":"green"}`}>{i===4?"Just Checked In":"Checked In"}</span></td></tr>)}</tbody></table><div style={{ textAlign:"center", padding:18 }}><span className="link">View all check-ins</span></div></div>; }
function Footer({ centered }: { centered?: boolean }) { return <div className="footer" style={centered ? { justifyContent: "center" } : undefined}><span>© 2024 ClinicQ. All rights reserved.</span>{!centered ? <span>Data is updated every 15 minutes</span> : null}</div>; }
