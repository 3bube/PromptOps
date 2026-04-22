const fs = require('fs');
let content = fs.readFileSync('components/blocks/features-8.tsx', 'utf8');
const startIdx = content.indexOf('<svg\n                    className="m-auto h-fit w-24"');
const endIdx = content.indexOf('</svg>', startIdx) + 6;
if (startIdx !== -1 && endIdx > startIdx) {
  const newContent = content.slice(0, startIdx) + 
`<div className="m-auto flex h-full w-full items-center justify-center relative">
                    <Library className="h-10 w-10 text-zinc-400" />
                    
                    <div className="absolute -top-2 -right-8 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 shadow-sm rotate-[12deg] transition-transform hover:scale-105 z-10">
                      <Target className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-[10px] font-medium text-zinc-700">Goal</span>
                    </div>

                    <div className="absolute -bottom-2 -left-6 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 shadow-sm rotate-[-8deg] transition-transform hover:scale-105 z-10">
                      <Shield className="h-3.5 w-3.5 text-teal-500" />
                      <span className="text-[10px] font-medium text-zinc-700">Rules</span>
                    </div>

                    <div className="absolute top-12 -right-6 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 shadow-sm rotate-[-10deg] transition-transform hover:scale-105 z-10">
                      <Code2 className="h-3.5 w-3.5 text-purple-500" />
                      <span className="text-[10px] font-medium text-zinc-700">Format</span>
                    </div>
                  </div>` + content.slice(endIdx);
  fs.writeFileSync('components/blocks/features-8.tsx', newContent);
  console.log("Success");
} else {
  console.log("Not found");
}
