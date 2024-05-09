import React, {useState,useEffect} from 'react';
import './App.css';
import NotesContainer from './componets/Notes/NotesConterner';
import Preview from './componets/Preview';
import Massage from './componets/Massage';
import Note from './componets/Notes/Note';
import NotesList from './componets/Notes/NotesList';
import NoteForm from './componets/Notes/NoteForm';
import Alert from './componets/Alert/Alert';


function App() {

  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  // تغيير عنوان الملاحظه

  const changeTitleHandler = event => {
    setTitle(event.target.value)
  }

  // تغيير محتوى الملاحظه
  const changeContentHandler = event =>{
    setContent(event.target.value)
  }

  // حفظ الملاحظة
  const saveNoteHandler = () =>{
    
    if(!validate()) return; // فائد ريتيرن هنا هوا الخروج من الداله وليس اعطاء نتيجة
    const note = {
      id: new Date(),
      title: title,
      content: content
    }


    const updatedNotes = [...notes, note]
    saveToLocalStorage('notes' , updatedNotes)
    setNotes(updatedNotes)
    setCreating(false)
    setSelectedNote(note.id)
    setTitle('')
    setContent('')
  }
  
    // أختيار ملاحظة

    const selectNoteHandler = noteId => {
      setSelectedNote(noteId)
      setCreating(false)
      setEditing(false)
    }


    // وضع تعديل الملاحظه
    const editNoteHandler = () =>{
      const note = notes.find(note => note.id === selectedNote)
      setEditing(true)
      setTitle(note.title)
      setContent(note.content)
      
    }

    // تعديل الملاحظه
    const updateNoteHandler = () =>{
      if(!validate()) return; // فائد ريتيرن هنا هوا الخروج من الداله وليس اعطاء نتيجة
      const updatedNotes = [...notes,]
      const noteIndex = notes.findIndex(note => note.id === selectedNote)
      updatedNotes[noteIndex] ={
        id: selectedNote,
        title: title,
        content: content,
      } 

    saveToLocalStorage('notes' , updatedNotes)
    setNotes(updatedNotes)
    setEditing(false)


    setTitle('')
    setContent('')
    }

    //حذف ملاحظة
    const deleteNoteHandler = () =>{
      const updatedNotes = [...notes]
      const noteIndex = updatedNotes.findIndex(note => note.id === selectedNote)
      notes.splice(noteIndex, 1)
      saveToLocalStorage('notes' ,notes)
      setNotes(notes)
      setSelectedNote(null)
    }
    // أخذ البيانات من التخزين المحلي
    useEffect(() =>{
      if(localStorage.getItem('notes')){
        setNotes(JSON.parse(localStorage.getItem('notes')))
      }else{
        localStorage.setItem('notes',JSON.stringify([]))
      }
    },[])


    // لأخفاء اشعار عدم ملئ الحقول
    useEffect(()=>{
      if(validationErrors.length !== 0){
        setTimeout(() =>{
          setValidationErrors([])
        }, 3000)
      }
    },[validationErrors])
    
    // حفظ البيانات وكتابتها في التخزين المحلي

    const saveToLocalStorage = (key,value) =>{
      localStorage.setItem(key, JSON.stringify(value))
    }

    // التحقق من أن الحقول غير فارغه

    const validate = () =>{
      const validationErrors = []
      let passed = true
      if(!title){
        validationErrors.push('الرجاء اضافة عنوان للملاحظة')
        passed = false
      }

      if(!content){
        validationErrors.push('الرجاء اضافة محتوى للماحظة')
        passed = false
      }
      
      setValidationErrors(validationErrors)
      return passed
    }

  const getAddNote = () => {
    return (
     <NoteForm 
        formTitle='ملاحظة جديده'
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitText='حفظ'
        submitClicked={saveNoteHandler}
     />
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return(
        <Massage title=' لا توجد ملاحظات'/>
      )
    }

    if (!selectedNote){
      return(
        <Massage title='الرجاء اختيار ملاحظة'/>

      )
    }

    const note = notes.find(note =>{
      return note.id === selectedNote
    })

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )
    if (editing){

       noteDisplay = (
        <NoteForm 
        formTitle='تعديل الملاحظة'
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitText='تعديل'
        submitClicked={updateNoteHandler}
     />
      )
    }

    


    return (
      <div>
        {!editing &&
        <div className="note-operations">
          <a href="#" onClick={editNoteHandler}>
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#" onClick={deleteNoteHandler}>
            <i className="fa fa-trash" />
          </a>
      </div>
        }
        
        {noteDisplay}
      </div>
    );
  };
  const addNoteHandler = () =>{
    setCreating(true)
    setEditing(false)
    setTitle('')
    setContent('')
  }

  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
         {notes.map(note=> 
         <Note 
         key={note.id} 
         title={note.title} 
         active = {selectedNote === note.id}
         noteClicked={() => selectNoteHandler(note.id)}/>)}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NotesContainer>
      <Preview className="preview-section">
        {creating ? getAddNote() : getPreview()}
        </Preview>
        {validationErrors.length !== 0 && <Alert validationMassage={validationErrors}/>}
    </div>
  );
}

export default App;
