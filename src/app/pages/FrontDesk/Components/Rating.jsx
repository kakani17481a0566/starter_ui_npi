// Local Imports
// import { Card, Circlebar } from "components/ui";
import {  Circlebar } from "components/ui";


// ----------------------------------------------------------------------

export function Rating() {
  return (
    // <Card className="flex items-center gap-3 p-4">
      <Circlebar size={12} value={85} color="success" isActive strokeWidth={10}>
        <div className="flex items-center justify-center text-xs">85%</div>
      </Circlebar>

    // </Card>
  );
}
