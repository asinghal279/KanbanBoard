/**
 *
 * TaskCard
 *
 */

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box, Flex, IconButton, Text } from '@chakra-ui/core';
import { DeleteIcon } from '@chakra-ui/icons';

function Task({ id, index, content, columnId, deleteItem }) {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <Flex
            draggable
            h={20}
            p={4}
            justify="space-between"
            bg="white"
            rounded="md"
            color="#282c34"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{ ...provided.draggableProps.style }}
          >
            <Text fontWeight={600}>{content}</Text>
            <IconButton
              size="sm"
              bg="none"
              color="black"
              icon={<DeleteIcon />}
              onClick={() => deleteItem(index, columnId)}
            />
          </Flex>
        );
      }}
    </Draggable>
  );
}

export default Task;
