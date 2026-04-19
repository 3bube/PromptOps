import { ClaudeChatInput } from "@/components/ui/claude-style-chat-input";

interface PromptCardProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onGenerateAndRun: () => void;
  isLoading: boolean;
}

const PromptCard = ({
  inputValue,
  onInputChange,
  onGenerateAndRun,
  isLoading,
}: PromptCardProps) => {
  const handleSend = (data: {
    message: string;
    files: any[];
    pastedContent: any[];
  }) => {
    onInputChange(data.message);
    onGenerateAndRun();
  };

  return (
    <div
      id="prompt-card"
      className="card-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-8 glow-primary animate-fade-in-scale"
    >
      <ClaudeChatInput
        value={inputValue}
        onChange={onInputChange}
        isLoading={isLoading}
        onSendMessage={handleSend}
      />
    </div>
  );
};

export default PromptCard;
