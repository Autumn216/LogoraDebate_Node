import React, { useState, useEffect } from 'react';
import { ListProvider } from './ListProvider';
import { useList } from './useList';

const List = () => {
    const [elements, setElements] = useState(["first element"]);
    const uniqueListId = "myList";
    const { listId, addElement, removeElement, setAddElement, setRemoveElement } = useList();

    useEffect(() => {
        if(addElement && listId === uniqueListId) {
            setElements(prevState => [...prevState, addElement]);
        }
    }, [addElement]);

    useEffect(() => {
        if(removeElement && listId === uniqueListId) {
            setElements((prevState) =>
                prevState.filter((prevItem) => prevItem !== removeElement)
            );
        }
    }, [removeElement])

    return (
        <div>
            <div className="listTitle">List</div>
            <div>
                {
                    elements.map((el, index) => {
                        return <div key={index} className="listElement">{ el }</div>;
                    })
                }
            </div>
        </div>
        
    );
}

const ListManager = () => {
    const { add, remove } = useList();
    const [counter, setCounter] = useState(0);

    const handleAdd = () => {
        setCounter(counter + 1);
        add("myList", `hello-${counter + 1}`);
    }

    const handleRemove = () => {
        if(counter > 0) {
            remove("myList", `hello-${counter}`);
            setCounter(counter - 1);
        }
    }

    return (
        <>
            <button onClick={ handleAdd }>Add element</button>
            <button onClick={ handleRemove }>Remove element</button>
        </>
    );
}

export const DefaultListProvider = (props) => {
    return (
        <ListProvider>
            <ListManager />
            <List />
        </ListProvider>
    )
}