import { useState } from "preact/hooks";

export default function CreateContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const res = await fetch("https://back-a-p4.onrender.com/contacts/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const errorText = await res.text();
      alert("Error al crear contacto:\n" + errorText);
      return;
    }

    globalThis.location.href = "/";
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={form.name}
        required
        onInput={(e) => setForm({ ...form, name: e.currentTarget.value })}
      />
      <br />
      <input
        type="email"
        placeholder="Correo"
        value={form.email}
        required
        onInput={(e) => setForm({ ...form, email: e.currentTarget.value })}
      />
      <br />
      <input
        type="tel"
        placeholder="Teléfono"
        value={form.phone}
        required
        onInput={(e) => setForm({ ...form, phone: e.currentTarget.value })}
      />
      <br />
      <button type="submit">Crear</button>
    </form>
  );
}