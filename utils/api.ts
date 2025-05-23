const BASE = "https://back-a-p4.onrender.com";

type ContactFromAPI = {
  _id: string;
  name: string;
  phone: string;
  email: string;
};

type ChatFromAPI = {
  _id: string;
  contact: ContactFromAPI | null;
};

type MessageFromAPI = {
  content: string;
  isContactMessage: boolean;
};

// Traigo la lista de contactos y cambio _id por id para que sea más cómodo
export async function getContacts() {
  const res = await fetch(`${BASE}/contacts/`);
  const data = await res.json();
  return Array.isArray(data.data)
    ? data.data.map((c: ContactFromAPI) => ({
        id: c._id,
        name: c.name,
        phone: c.phone,
        email: c.email,
      }))
    : [];
}

// Pido todos los chats existentes
export async function getChats() {
  const res = await fetch(`${BASE}/chats/`);
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

// Obtengo los mensajes de un chat específico
export async function getMessages(chatId: string) {
  const res = await fetch(`${BASE}/messages/chat/${chatId}`);
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

// Envío un mensaje para crear un chat o mandar uno nuevo
export async function sendMessage(data: {
  chatId: string;
  content: string;
  isContactMessage: boolean;
}) {
  const res = await fetch(`${BASE}/messages/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Error al enviar mensaje");
  }
  return await res.json();
}
