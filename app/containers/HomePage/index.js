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
  Grid,
  Heading,
  Stack,
} from '@chakra-ui/core';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import uuid from 'uuid/v4';
import { v4 } from 'uuid';

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

export default function HomePage() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <Box bg="#282c34" w="100%" h="100%">
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
                        bg="#49505e"
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
