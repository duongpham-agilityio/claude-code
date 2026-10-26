export interface TodoItemSampleProps {
  completed: boolean;
  itemID: string;
  title: string;
  onToggle: (status: boolean) => void;
}

export const TodoItemSample = (props: TodoItemSampleProps) => {
  const toggleTodo = () => {
    props.onToggle(!props.completed);
  };

  return (
    <li onClick={toggleTodo}>
      <p>{props.title}</p>
      <input type="checkbox" name={props.itemID} id={props.itemID} />
    </li>
  );
};
