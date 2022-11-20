import { ITodo } from '../TodoThumb/TodoThumb';
import { useForm, SubmitHandler } from 'react-hook-form';
import React, { useContext, useState} from 'react';
import { readFileAsync } from '../../utils';
import { doc, setDoc, addDoc, collection  } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';
import { Context } from '../App/App';

interface TodoFormProps {
	item: ITodo;
	create: boolean;
	close: () => void;
}

const FORM_INITIAL = {
	// id: '',
  title: '',
  deadline: '',
  description: '',
  done: false,
	file: null,
};

export interface ITodoForm {
  title: string;
  description: string;
  deadline: string;
  file?: FileList | null;
  done: boolean;
}

export const TodoForm = ({close, create, item}: TodoFormProps) => {
	const { id, file, fileName, title, description, deadline, done } = item;
	const { state, setState } = useContext(Context);
	
	const {
		handleSubmit,
		register,
		formState: {isValid}
	} = useForm<ITodoForm>({
    defaultValues: create ? FORM_INITIAL : {title, description, deadline, done},
  });

	const onSubmit: SubmitHandler<ITodoForm> = async (data) => {
		const newTodo = {
			...data,
			file: upload || '',
			fileName: upload ? fileName : '',
			id,
		}
		
		if (create){
			await addDoc(collection(db, "list"), {...newTodo}).then(docRef => {
				setState([...state, { ...newTodo, id: docRef.id}]);
			})
		} else {
			await setDoc(doc(db, "list", id), {...newTodo});
			const preserve = [...state];
			const i = preserve.findIndex(todo => todo.id === id);
			preserve[i] = newTodo;
			setState([...preserve]);
		}
		close();
  };

	const [fileErr, setFileErr] = useState('');
	const [uploadText, setUploadText] = useState(fileName || 'Attachment(max 1MB)...');
	const [upload, setUpload] = useState(file);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const {files} = e.target;
		setFileErr('');
		if (files) {
			if (files[0].size > 1048487) {
				setFileErr('File is too big');
			};
			
			setUpload(String(await readFileAsync(files[0])));
      setUploadText((files)[0].name);
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="form">
			<div className="form__row">
				<label className="label">
					<span className="label__text">Title*:</span>
					<input type="text" {...register('title', { required: true })} className="field" />
				</label>
				<label className="label">
					<span className="label__text">Deadline*:</span>
					<input type="date" {...register('deadline', { required: true })} className="field"></input>
				</label>
				<label className="label done">
					<span className="label__text">Completed:</span>
					<input type="checkbox" {...register('done')} className="field"></input>
				</label>
			</div>
			<label className="label">
				<span className="label__text">Description:</span>
				<textarea rows={3} {...register('description')} className="field textarea" ></textarea>
			</label>
			<label className="label upload btn">
				{uploadText}
				<input type="file" {...register('file')} onChange={handleUpload} ></input>
			</label>
			{upload && <>
				<a href={upload} download>{uploadText}</a>
			</>}
			{fileErr && <p className="error">{fileErr}</p>}
			<div className="form__row">
				<input type="submit" value={create ? 'Add' : 'Save'} className="submit btn" disabled={!isValid}></input>
			</div>
		</form>
	)
}