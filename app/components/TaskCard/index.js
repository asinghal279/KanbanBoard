/**
 *
 * TaskCard
 *
 */

import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Box,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/core';
import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
  InfoIcon,
} from '@chakra-ui/icons';

function CustomControlsExample() {
  /* Here's a custom control */
  function EditableControls({ isEditing, onSubmit, onCancel, onEdit }) {
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton icon={<CheckIcon />} onClick={onSubmit} />
        <IconButton icon={<CloseIcon />} onClick={onCancel} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton size="sm" icon={<EditIcon />} onClick={onEdit} />
      </Flex>
    );
  }

  return (
    <Editable
      textAlign="center"
      defaultValue="Rasengan ⚡️"
      fontSize="2xl"
      isPreviewFocusable={false}
      submitOnBlur={false}
    >
      {props => (
        <>
          <EditablePreview />
          <EditableInput />
          <EditableControls {...props} />
        </>
      )}
    </Editable>
  );
}

function Task({ id, index, content, columnId, deleteItem, editItem }) {
  const [contentValue, setContentValue] = useState(content);

  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <Flex
            draggable
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
            {/* <CustomControlsExample /> */}
            <Textarea
              value={contentValue}
              onChange={e => setContentValue(e.target.value)}
              onBlur={() => editItem(index, columnId, contentValue)}
              padding={0}
              outline="none"
              isFullWidth
              size="fit-content"
              border="none"
              fontWeight={600}
              style={{ overflow: 'hidden' }}
            />
            <Flex direction="column">
              <IconButton
                size="sm"
                bg="none"
                color="black"
                icon={<DeleteIcon />}
                onClick={() => deleteItem(index, columnId)}
              />
              <IconButton
                size="sm"
                bg="none"
                color="black"
                icon={<InfoIcon />}
                bg="none"
                _hover={{
                  bg: 'none',
                }}
              />
              <IconButton
                size="sm"
                bg="none"
                color="black"
                icon={<DragHandleIcon />}
                bg="none"
                _hover={{
                  bg: 'none',
                }}
              />
            </Flex>
          </Flex>
        );
      }}
    </Draggable>
  );
}

export default Task;
