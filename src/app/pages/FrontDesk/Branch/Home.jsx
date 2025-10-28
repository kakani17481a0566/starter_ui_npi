// src/app/pages/FrontDesk/Branch/Home.jsx
import BranchFrom from "./new-post-form/BranchFrom";

export function BranchHome({ onCancel, onCreated }) {
  return (
    <div>
      <BranchFrom onCancel={onCancel} onCreated={onCreated} />
    </div>
  );
}
