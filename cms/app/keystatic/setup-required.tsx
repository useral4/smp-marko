export default function SetupRequired() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
        background: "#f4f8f9",
        color: "#102b36",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "min(100%, 640px)",
          padding: "40px",
          borderRadius: "24px",
          background: "#fff",
          boxShadow: "0 16px 48px rgba(16, 43, 54, 0.12)",
        }}
      >
        <p style={{ margin: "0 0 12px", color: "#0b849c", fontWeight: 700 }}>
          СМП МАРКО · УПРАВЛЕНИЕ САЙТОМ
        </p>
        <h1 style={{ margin: "0 0 16px", fontSize: "36px", lineHeight: 1.1 }}>
          Админка почти готова
        </h1>
        <p style={{ margin: 0, fontSize: "18px", lineHeight: 1.55 }}>
          Осталось подключить безопасное сохранение материалов в GitHub. До этого
          момента редактирование выключено, чтобы ни один объект, статья или новость
          не потерялись.
        </p>
      </section>
    </main>
  );
}
