export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <div style={{ padding: "16px 24px", textAlign: "center", color: "#999" }}>
      Ilm Admin &copy; {year}
    </div>
  );
}
