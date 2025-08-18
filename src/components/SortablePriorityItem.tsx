import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PriorityItem } from './PriorityItem';
import { Priority } from '@/types';

interface SortablePriorityItemProps {
  priority: Priority;
  onToggleComplete: (id: string) => void;
  onUpdateSubnote: (id: string, subnote: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const SortablePriorityItem = (props: SortablePriorityItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.priority.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      <PriorityItem 
        {...props} 
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};