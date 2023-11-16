const { useState } = React;
const { TextField, Button, List, ListItem, ListItemText } = MaterialUI;

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    const handleNewTodoChange = (e) => {
        setNewTodo(e.target.value);
    };

    const handleNewTodo = (e) => {
        e.preventDefault();
        if (newTodo === '') return;
        setTodos([...todos, newTodo]);
        setNewTodo('');
    };

    const handleDeleteTodo = (index) => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };

    return (
        <div>
            <form onSubmit={handleNewTodo}>
                <TextField label="New todo" value={newTodo} onChange={handleNewTodoChange} />
                <Button type="submit">Add todo</Button>
            </form>
            <List>
                {todos.map((todo, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={todo} />
                        <Button onClick={() => handleDeleteTodo(index)}>
                            Delete
                        </Button>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
window.App = App
document.getElementById('loading').style.display = 'none';