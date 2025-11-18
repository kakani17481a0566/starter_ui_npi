import PuzzleGame from '../Component/Games/PuzzleGame';


export default function Games() {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-gray-800">🎮 Fun Nutrition Games</h3>
      <p className="text-gray-600">Challenge yourself and learn while playing!</p>
       <PuzzleGame />
    </div>


  );
}
