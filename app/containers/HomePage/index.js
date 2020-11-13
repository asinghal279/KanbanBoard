/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Flex,
  FormControl,
  Grid,
  Heading,
  IconButton,
  Input,
  localStorageManager,
  Stack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/core';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import uuid from 'uuid/v4';
import { v4 } from 'uuid';
import { CloseIcon } from '@chakra-ui/icons';

const itemsFromBackend = [
  { id: uuid(), content: 'First task' },
  { id: uuid(), content: 'Second task' },
  { id: uuid(), content: 'Third task' },
  { id: uuid(), content: 'Fourth task' },
  { id: uuid(), content: 'Fifth task' },
];

const columnsFromBackend = {
  [uuid()]: {
    name: 'Todo',
    items: itemsFromBackend,
  },
  [uuid()]: {
    name: 'In-Progress',
    items: [],
  },
  [uuid()]: {
    name: 'Completed',
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) {
    return;
  }
  const { source, destination } = result;
  if (source.droppableId != destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const sourceColumnItems = [...sourceColumn.items];
    const destinationColumnItems = [...destinationColumn.items];
    const [removed] = sourceColumnItems.splice(source.index, 1);
    destinationColumnItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceColumnItems,
      },
      [destination.droppableId]: {
        ...destinationColumn,
        items: destinationColumnItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const handleToggle = (onToggle, setCurrentId, currentId) => {
  setCurrentId(currentId);
  onToggle();
};

const handleAddItem = (
  e,
  item,
  columns,
  currentId,
  setColumns,
  setNewItem,
  onToggle,
) => {
  e.preventDefault();
  if (item != '') {
    const column = columns[currentId];
    let copiedItems = [...column.items];
    const obj = {
      id: uuid(),
      content: item,
    };
    // console.log(obj);
    copiedItems.push(obj);
    console.log(copiedItems);
    setColumns({
      ...columns,
      [currentId]: {
        ...column,
        items: copiedItems,
      },
    });
    setNewItem('');
    onToggle();
  }
};

export default function HomePage() {
  const { isOpen, onToggle } = useDisclosure();
  const [columns, setColumns] = useState(columnsFromBackend);
  const [currentId, setCurrentId] = useState(null);
  const [newItem, setNewItem] = useState('');
  return (
    <Box bg="#282c34" w="100%" minH="100vh" px={5}>
      <DragDropContext onDragEnd={res => onDragEnd(res, columns, setColumns)}>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {Object.entries(columns).map(([id, column]) => {
            return (
              <Droppable droppableId={id} key={id}>
                {(provided, snapshot) => {
                  return (
                    <Box>
                      <Heading color="white" textAlign="center">
                        {column.name}
                      </Heading>
                      <Stack
                        w="100%"
                        bg={snapshot.isDraggingOver ? 'lightgreen' : '#49505e'}
                        p={4}
                        spacing={4}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <Box
                                    draggable
                                    h={150}
                                    bg="white"
                                    rounded="md"
                                    color="#282c34"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{ ...provided.draggableProps.style }}
                                  >
                                    {item.content}
                                  </Box>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        <Button
                          id={id}
                          d={isOpen && currentId == id ? 'none' : 'block'}
                          onClick={() =>
                            handleToggle(onToggle, setCurrentId, id)
                          }
                        >
                          Click Me
                        </Button>
                        <Collapse
                          in={isOpen && currentId == id}
                          id={id}
                          animateOpacity
                        >
                          <Box p={2} mt="4" bg="white" rounded="sm" shadow="md">
                            <form
                              onSubmit={e => {
                                handleAddItem(
                                  e,
                                  newItem,
                                  columns,
                                  currentId,
                                  setColumns,
                                  setNewItem,
                                  onToggle,
                                );
                              }}
                            >
                              <FormControl>
                                <Textarea
                                  placeholder="Enter a title for this item..."
                                  value={newItem}
                                  onChange={e => setNewItem(e.target.value)}
                                />
                                <Flex justify="space-between">
                                  <Button
                                    size="sm"
                                    bg="#5aac44"
                                    color="white"
                                    type="submit"
                                  >
                                    Add
                                  </Button>
                                  <IconButton
                                    aria-label="Search database"
                                    size="sm"
                                    bg="none"
                                    color="black"
                                    icon={<CloseIcon />}
                                    onClick={onToggle}
                                  />
                                </Flex>
                              </FormControl>
                            </form>
                          </Box>
                        </Collapse>
                      </Stack>
                    </Box>
                  );
                }}
              </Droppable>
            );
          })}
        </Grid>
      </DragDropContext>
    </Box>
  );
}
