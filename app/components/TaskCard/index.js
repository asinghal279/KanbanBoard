/**
 *
 * TaskCard
 *
 */

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box } from '@chakra-ui/core';

function Task({ id, index, content }) {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <Box
            draggable
            h={20}
            p={4}
            bg="white"
            rounded="md"
            color="#282c34"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{ ...provided.draggableProps.style }}
          >
            {content}
          </Box>
        );
      }}
    </Draggable>
  );
}

export default Task;
