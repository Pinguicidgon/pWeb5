import { useEffect, useState } from "preact/hooks";
import {
  getContacts,
  getChats,
  getMessages,
  sendMessage,
} from "../utils/api.ts";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface ChatFromAPI {
  _id: string;
  contact: Contact | null;
}

interface Message {
  content: string;
  isContactMessage: boolean;
}

export default function ChatInteraction() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);

  // Cuando inicio la app, traigo los contactos
  useEffect(() => {
    setLoadingContacts(true);
    getContacts()
      .then((data) => Array.isArray(data) && setContacts(data))
      .catch(() => alert("Error al obtener contactos"))
      .finally(() => setLoadingContacts(false));
  }, []);

  // Refresco los mensajes cada 2 segundos si hay un chat abierto
  useEffect(() => {
    if (!chatId) return;
    const interval = setInterval(async () => {
      const msgs = await getMessages(chatId);
      if (Array.isArray(msgs)) setMessages(msgs);
    }, 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  // Cuando elijo un contacto, busco si ya tengo un chat con él
  const handleSelect = async (contactId: string) => {
    setSelectedContactId(contactId);
    setMessages([]);
    setChatId(null);

    try {
      const chats = await getChats();
      const chat = (chats as ChatFromAPI[]).find(
        (c) =>
          c.contact &&
          ((c.contact as any).id === contactId ||
            (c.contact as any)._id === contactId)
      );

      if (chat) {
        setChatId(chat._id);
        const msgs = await getMessages(chat._id);
        setMessages(Array.isArray(msgs) ? msgs : []);
      } else {
        // Si no hay chat, espero a que yo mismo escriba el primer mensaje
        setChatId(null);
        setMessages([]);
      }
    } catch (e: unknown) {
      let msg = "Algo salió mal al seleccionar el contacto.";
      if (e instanceof Error) msg = e.message;
      alert(msg);
      setChatId(null);
      setMessages([]);
    }
  };

  // Envío un mensaje nuevo
  const handleSend = async () => {
    if (!text.trim() || !selectedContactId) {
      alert("Selecciona un chat y escribe un mensaje.");
      return;
    }
    try {
      // Si ya existe el chat, lo uso, si no, uso el id del contacto para que la API cree el chat
      const idParaEnviar = chatId ? chatId : selectedContactId;
      await sendMessage({ chatId: idParaEnviar, content: text, isContactMessage: false });

      // Ahora busco el chat (por si se acaba de crear) y recargo mensajes
      const chats = await getChats();
      const chat = (chats as ChatFromAPI[]).find(
        (c) =>
          c.contact &&
          ((c.contact as any).id === selectedContactId ||
            (c.contact as any)._id === selectedContactId)
      );
      if (chat) {
        setChatId(chat._id);
        const msgs = await getMessages(chat._id);
        setMessages(Array.isArray(msgs) ? msgs : []);
      }
      setText("");
    } catch (e: unknown) {
      let msg = "No pude enviar el mensaje.";
      if (e instanceof Error) msg = e.message;
      alert(msg);
    }
  };

  return (
    <div style="display: flex; height: 100vh;">
      {/* Lista de contactos */}
      <div style="width: 20%; border-right: 1px solid #ccc; overflow-y: auto;">
        <button onClick={() => (globalThis.location.href = "/create")}>
          Crear contacto
        </button>
        {loadingContacts ? (
          <p style="padding: 10px;">Cargando contactos...</p>
        ) : contacts.length === 0 ? (
          <p style="padding: 10px; color: #888;">No hay contactos.</p>
        ) : (
          contacts.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelect(c.id)}
              style={{
                padding: "10px",
                cursor: "pointer",
                background: selectedContactId === c.id ? "#e0f7fa" : "transparent",
                fontWeight: selectedContactId === c.id ? "bold" : "normal",
                borderLeft: selectedContactId === c.id ? "4px solid #0077b6" : "none",
                marginBottom: "2px",
              }}
            >
              <strong>{c.name}</strong>
              <div>{c.phone}</div>
            </div>
          ))
        )}
      </div>

      {/* Zona de chat */}
      <div style="flex: 1; display: flex; flex-direction: column;">
        <div style="flex: 1; overflow-y: auto; padding: 10px;">
          {messages.length > 0 ? (
            messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.isContactMessage ? "left" : "right",
                  margin: "5px 0",
                  backgroundColor: m.isContactMessage ? "#eee" : "#cce5ff",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  maxWidth: "60%",
                  alignSelf: m.isContactMessage ? "flex-start" : "flex-end",
                }}
              >
                {m.content}
              </div>
            ))
          ) : (
            <p style={{ color: "#888" }}>No hay mensajes.</p>
          )}
        </div>

        {/* Campo para escribir y botón enviar */}
        <div style="display: flex; border-top: 1px solid #ccc;">
          <input
            type="text"
            value={text}
            placeholder="Escribe tu mensaje"
            onInput={(e) => setText(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style="flex: 1; padding: 10px;"
          />
          <button type="button" onClick={handleSend} style="padding: 10px;">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
