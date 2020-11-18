/**
 *
 * TaskCard
 *
 */

import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/core';
import { DeleteIcon } from '@chakra-ui/icons';

function Task({ id, index, content, columnId, deleteItem, editItem }) {
  const [contentValue, setContentValue] = useState(content);

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
            <Input
              value={contentValue}
              onChange={e => setContentValue(e.target.value)}
              onBlur={() => editItem(index, columnId, contentValue)}
              padding={0}
              outline="none"
              border="none"
              w="fit-content"
              fontWeight={600}
            />
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
