import { ChatPanel } from "@/components/chat-panel";

export default function SessionPage() {
  return (
    <section className="pageShell">
      <div className="pageIntro">
        <p className="eyebrow">Live Studio</p>
        <h1>Voice-first bilingual coaching</h1>
        <p>Use the microphone to speak. The coach answers with a measured amount of target language.</p>
      </div>
      <ChatPanel />
    </section>
  );
}

