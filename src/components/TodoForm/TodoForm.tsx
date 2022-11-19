import { ITodo } from '../TodoThumb/TodoThumb';
import { useForm, SubmitHandler } from 'react-hook-form';
import React, { useState, useEffect} from 'react';
import { readFileAsync } from '../../utils';

interface TodoFormProps {
	item: ITodo;
	create: boolean;
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
  // file?: FileList | null;
  done: boolean;
}

export const TodoForm = ({create, item}: TodoFormProps) => {
	const { file } = item;
	


	const {
		handleSubmit,
		register,
    watch,
		formState: {isValid}
	} = useForm<ITodoForm>({
    defaultValues: create ? FORM_INITIAL : {...item},
  });

    
	// useEffect(() => {
  //   const subscription = watch((value) => {
  //     if (value.file) {
  //       const text = (value.file as FileList)[0].name;
  //       setUploadText(text);
				
	// 			fileSrc = String(await readFileAsync(value.file[0]));
  //     }
  //   });


  //   return () => subscription.unsubscribe();
  // }, [watch]);

	

	const onSubmit: SubmitHandler<ITodoForm> = async (data) => {
    // TODO: add todo
		console.log('submit');
		console.log(data);

		const newTodo = {
			...data,
			file: upload,
		}

		console.log(newTodo);
  };


	const [uploadText, setUploadText] = useState('Pick file');
	const [upload, setUpload] = useState(file);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e);
		const {files} = e.target;
		if (files) {
			setUpload(String(await readFileAsync(files[0])));
      setUploadText((files)[0].name);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="form">
			<div className="form__row">
				<label className="label">
					<span className="label__text">Title:</span>
					<input type="text" {...register('title', { required: true })} className="field" />
				</label>
				<label className="label">
					<span className="label__text">Deadline:</span>
					<input type="date" {...register('deadline', { required: true })} className="field"></input>
				</label>
				<label className="label done">
					<span className="label__text">Completed:</span>
					<input type="checkbox" {...register('done', { required: true })} className="field"></input>
				</label>
			</div>
			<label className="label">
				<span className="label__text">Description:</span>
				<textarea rows={3} {...register('description', { required: true })} className="field textarea" ></textarea>
			</label>
			<label className="label upload btn">
				{uploadText}
				<input type="file" name="file" onChange={handleUpload} ></input>
			</label>
			{upload && <>
				<a href={upload} download>{uploadText}</a>
			</>
			}
			<input type="submit" value={create ? 'Add' : 'Save'} className="submit btn"></input>
		</form>
	)
}