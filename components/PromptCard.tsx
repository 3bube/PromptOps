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
    model: string;
    isThinkingEnabled: boolean;
  }) => {
    onInputChange(data.message);
    onGenerateAndRun();
  };

  return (
    <div className="card-elevated rounded-3xl p-8 glow-primary animate-fade-in-scale">
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
