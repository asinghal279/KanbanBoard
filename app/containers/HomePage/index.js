/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  Grid,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  Editable,
  EditableInput,
  EditablePreview,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useDisclosure,
  ButtonGroup,
} from '@chakra-ui/core';
import { Droppable, DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import TaskCard from '../../components/TaskCard/index';

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
    const finalColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceColumnItems,
      },
      [destination.droppableId]: {
        ...destinationColumn,
        items: destinationColumnItems,
      },
    };
    localStorage.setItem('columns', JSON.stringify(finalColumns));
    setColumns(finalColumns);
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    const finalColumns = {
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    };
    localStorage.setItem('columns', JSON.stringify(finalColumns));
    setColumns(finalColumns);
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
    const finalColumns = {
      ...columns,
      [currentId]: {
        ...column,
        items: copiedItems,
      },
    };
    localStorage.setItem('columns', JSON.stringify(finalColumns));
    setColumns(finalColumns);
    setNewItem('');
    onToggle();
  }
};

const handleDeleteItem = (itemIndex, columns, columnId, setColumns) => {
  const column = columns[columnId];
  let copiedItems = [...column.items];
  copiedItems.splice(itemIndex, 1);
  const finalColumns = {
    ...columns,
    [columnId]: {
      ...column,
      items: copiedItems,
    },
  };
  localStorage.setItem('columns', JSON.stringify(finalColumns));
  setColumns(finalColumns);
};

const handleEditItem = (itemIndex, columns, columnId, setColumns, data) => {
  const column = columns[columnId];
  let copiedItems = [...column.items];
  const itemToBeEditted = copiedItems.splice(itemIndex, 1)[0];
  itemToBeEditted.content = data;
  copiedItems.splice(itemIndex, 0, itemToBeEditted);
  const finalColumns = {
    ...columns,
    [columnId]: {
      ...column,
      items: copiedItems,
    },
  };
  localStorage.setItem('columns', JSON.stringify(finalColumns));
  setColumns(finalColumns);
};

export default function HomePage() {
  const { isOpen, onToggle } = useDisclosure();
  const [columns, setColumns] = useState(
    JSON.parse(localStorage.getItem('columns')) || columnsFromBackend,
  );
  const [currentId, setCurrentId] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [activeItemColumnId, setActiveItemColumnId] = useState(null);
  const [contentValue, setContentValue] = useState('');

  useEffect(() => {
    if (activeItemColumnId != null && activeItemIndex != null) {
      setContentValue(
        columns[activeItemColumnId].items[activeItemIndex].content,
      );
    }
  }, [activeItemColumnId, activeItemIndex]);

  return (
    <Box bg="#282c34" w="100%" minH="100vh" px={5}>
      <Modal isOpen={modalIsOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Task Details</ModalHeader>
          <ModalBody>
            <Textarea
              value={contentValue}
              onChange={e => setContentValue(e.target.value)}
              onBlur={() =>
                handleEditItem(
                  activeItemIndex,
                  columns,
                  activeItemColumnId,
                  setColumns,
                  contentValue,
                )
              }
              padding={0}
              outline="none"
              size="fit-content"
              border="none"
              fontWeight={600}
              style={{ overflow: 'hidden' }}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => setModalIsOpen(false)}
            >
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <DragDropContext onDragEnd={res => onDragEnd(res, columns, setColumns)}>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {Object.entries(columns).map(([id, column]) => {
            return (
              <Droppable droppableId={id} key={id}>
                {(provided, snapshot) => {
                  return (
                    <Box>
                      <Heading color="white" textAlign="center" mb={2}>
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
                            <TaskCard
                              key={item.id}
                              {...item}
                              index={index}
                              columnId={id}
                              editItem={(itemIndex, columnId) => {
                                setActiveItemColumnId(columnId);
                                setActiveItemIndex(itemIndex);
                                setModalIsOpen(true);
                              }}
                              deleteItem={(itemIndex, columnId) =>
                                handleDeleteItem(
                                  itemIndex,
                                  columns,
                                  columnId,
                                  setColumns,
                                )
                              }
                            />
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
                          + Add New Task
                        </Button>
                        <Collapse
                          in={isOpen && currentId == id}
                          id={id}
                          animateOpacity
                        >
                          <Box p={2} bg="white" rounded="sm" shadow="md">
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
                                    + Add
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
