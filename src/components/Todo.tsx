import { DocumentData } from 'firebase/firestore/lite';

export interface todoType extends DocumentData {
  id: string;
  title: string;
  description: string;
  deadline: string;
  file?: string;
}
export const Todo = (props: todoType) => {
	const {id, title} = props;
	return (
		<li key={id}>
    <p>{title}</p>
  </li>
	)
}