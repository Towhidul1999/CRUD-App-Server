const express = require('express');
const app = express();

//Middleware
app.use(express.json())

let notes = [
    {
        id: 1,
        title: 'This is notes title 1',
        description: 'This is notes description 1'
    },
    {
        id: 2,
        title: 'This is notes title 2',
        description: 'This is notes description 2'
    }
]

//Home Route
app.get('/', (req, res) => {
    res.send('Welcome to notes App')
})

//Get all notes
app.get('/notes', (req, res) => {
    if(notes.length == 0){
        return ('No Notes available')
    };
    res.send(notes)
})

//Get single note
app.get('/notes/:noteId', (req, res) => {
    const noteId = parseInt(req.params.noteId);
    const note = notes.find(note => note.id === noteId);
    if(note) return res.send(note)
    res.send('Note not available')
})

//Adding Notes
app.post('/notes', (req, res) => {
    const note = req.body;
    notes = [...notes, note]
    res.send(notes)
})

//Update Note
app.put('/notes/:noteId', (req, res) => {
    const noteId = parseInt(req.params.noteId);
    const noteInput = req.body;
    const gotNoteInput = Object.keys(noteInput)
    const allowedUpdate = ['title', 'description']
    try{
        const isAllowed = gotNoteInput.every(update => allowedUpdate.includes(update));
        if(!isAllowed){
            return res.status(400).send('Invalid Operation')
        }
        const note = notes.find(note => note.id === noteId);
        if(note){
        //Success update
        notes = notes.map(note => {
            if(note.id === noteId){
                return{
                    ...note,
                    ...noteInput
                }
            }else{
                return note
            }
        });
        res.send(notes)
        }else{
        //Deal with note that note found
        return res.status(404).send('Notes Not Found')
        }
    }catch(err){
       //Server error
       res.status(500).send('Internal Server Error')
    }
})

//Delete Note
app.delete('/notes/:noteId', (req, res) => {
    const noteId = parseInt(req.params.noteId);
    try{
        //Find note
    const note = notes.find(note => note.id === noteId);
    //Delete note
    if(note){
        notes = notes.filter(note => note.id !== noteId)
        res.send(notes)
    }else{
        //Note Not Found
        res.status(404).send('Note Not Found')
    }
    }catch(err){
        res.status(500).send('Internal Server Error')
    }
    
})

//Not Found
app.get('*', (req, res) => {
    res.status(404).send('404 Not Found')
})

//Creating Server
app.listen(3000, () => {
    console.log('Server is created and listening on port 3000')
})