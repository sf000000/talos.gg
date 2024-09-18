// app/game/[id]/page.tsx

import GameDetails from "@/app/components/game-details";

interface PageProps {
  params: {
    id: string;
  };
}

export default function GamePage({ params }: PageProps) {
  const { id } = params;
  // Now you can use 'id' without TypeScript errors

  return (
    <div className="container mx-auto p-4 mt-20">
      <GameDetails id={id} />
    </div>
  );
}
