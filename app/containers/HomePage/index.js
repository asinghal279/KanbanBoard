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
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useDisclosure,
  Input,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/core';
import { Droppable, DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import TaskCard from '../../components/TaskCard/index';

export default function HomePage() {
  const itemsFromBackend = [
    { id: uuid(), content: 'First task', description: 'Data1' },
    { id: uuid(), content: 'Second task', description: 'Data2' },
    { id: uuid(), content: 'Third task', description: 'Data3' },
    { id: uuid(), content: 'Fourth task', description: 'Data4' },
    { id: uuid(), content: 'Fifth task', description: 'Data5' },
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

  const { isOpen, onToggle } = useDisclosure();
  const [columns, setColumns] = useState(
    JSON.parse(localStorage.getItem('columns')) || columnsFromBackend,
  );
  const [currentId, setCurrentId] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [activeItemColumnId, setActiveItemColumnId] = useState(null);
  const [contentValue, setContentValue] = useState('');
  const [description, setDescription] = useState('');
  const [filterInputValue, setFilterInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (activeItemColumnId != null && activeItemIndex != null) {
      setContentValue(
        columns[activeItemColumnId].items[activeItemIndex].content,
      );
      setDescription(
        columns[activeItemColumnId].items[activeItemIndex].description,
      );
    }
  }, [activeItemColumnId, activeItemIndex]);

  useEffect(() => {
    if (filterInputValue === '') {
      setFilteredItems([]);
    } else {
      let obj = handleFilteredItems(filterInputValue);
      setFilteredItems(prevState => ([...prevState], [...obj]));
    }
  }, [filterInputValue]);

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
    itemDesc,
    columns,
    currentId,
    setColumns,
    setNewItem,
    setNewItemDesc,
    onToggle,
  ) => {
    e.preventDefault();
    if (item != '') {
      const column = columns[currentId];
      let copiedItems = [...column.items];
      const obj = {
        id: uuid(),
        content: item,
        description: itemDesc,
      };
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
      setNewItemDesc('');
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

  const handleEditItemContent = (
    itemIndex,
    columns,
    columnId,
    setColumns,
    data,
  ) => {
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

  const handleEditItemDesc = (
    itemIndex,
    columns,
    columnId,
    setColumns,
    data,
  ) => {
    const column = columns[columnId];
    let copiedItems = [...column.items];
    const itemToBeEditted = copiedItems.splice(itemIndex, 1)[0];
    itemToBeEditted.description = data;
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

  const handleFilteredItems = val => {
    let obj = Object.entries(columns).reduce((acc, column) => {
      let obj2 = column[1].items.reduce((acc, item, index) => {
        if (item.content.toLowerCase().startsWith(val.toLowerCase())) {
          let newObj = { ...item, itemIndex: index, columnId: column[0] };
          acc.push(newObj);
        }
        return acc;
      }, []);
      acc = acc.concat(obj2);
      return acc;
    }, []);
    return obj;
  };

  return (
    <Box bg="#282c34" w="100%" minH="100vh" px={5}>
      <Flex p={4} color="white" align="center" bg="#49505e">
        <Text fontSize={18} mr={4}>
          Search
        </Text>
        <Input
          placeholder="Enter card title..."
          size="sm"
          onChange={e => {
            setFilterInputValue(e.target.value);
            e.target.focus();
          }}
          value={filterInputValue}
          variant="flushed"
          w="20%"
        />
        <Stack
          position="absolute"
          p={2}
          top="47px"
          left="110px"
          w={200}
          bg="white"
          d={filteredItems.length ? 'flex' : 'none'}
          sapcing={4}
          direction="column"
        >
          {filteredItems.map(item => (
            <Button
              color="black"
              w="100%"
              key={item.id}
              onClick={() => {
                setActiveItemColumnId(item.columnId);
                setActiveItemIndex(item.itemIndex);
                setFilterInputValue('');
                setModalIsOpen(true);
              }}
            >
              {item.content}
            </Button>
          ))}
        </Stack>
      </Flex>
      <Modal isOpen={modalIsOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Task Details</ModalHeader>
          <ModalBody>
            <Text as="i">
              <CheckIcon mr={2} />
              Title
            </Text>
            <Input
              value={contentValue}
              mt={5}
              mb={5}
              onChange={e => setContentValue(e.target.value)}
              onBlur={() =>
                handleEditItemContent(
                  activeItemIndex,
                  columns,
                  activeItemColumnId,
                  setColumns,
                  contentValue,
                )
              }
              pl={3}
              outline="none"
              fontWeight={600}
              style={{ overflow: 'hidden' }}
            />
            <Text as="i">
              <EditIcon mr={2} />
              Description
            </Text>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={() =>
                handleEditItemDesc(
                  activeItemIndex,
                  columns,
                  activeItemColumnId,
                  setColumns,
                  contentValue,
                )
              }
              pl={3}
              mt={5}
              outline="none"
              size="fit-content"
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
                                  newItemDescription,
                                  columns,
                                  currentId,
                                  setColumns,
                                  setNewItem,
                                  setNewItemDescription,
                                  onToggle,
                                );
                              }}
                            >
                              <FormControl>
                                <Input
                                  placeholder="Enter a title for this item..."
                                  value={newItem}
                                  onChange={e => setNewItem(e.target.value)}
                                  mb={3}
                                />
                                <Textarea
                                  placeholder="Enter a description for this item..."
                                  value={newItemDescription}
                                  onChange={e =>
                                    setNewItemDescription(e.target.value)
                                  }
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
