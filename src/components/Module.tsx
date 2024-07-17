import React from 'react';
import { Box } from '@mui/material';
import { useDrag, useDragDropManager } from 'react-dnd';
import { useRafLoop } from 'react-use';

import ModuleInterface, { Coord } from '../types/ModuleInterface';
import {  moduleW2LocalWidth, moduleX2LocalX, moduleY2LocalY } from '../helpers';

type ModuleProps = {
  data: ModuleInterface;
  handleUpdateCoord: (moduleId: number, coord: Pick<Coord, 'y' | 'x'>) => void;
  getModulesData: () => ModuleInterface[];
};


const Module = React.forwardRef<HTMLDivElement, ModuleProps>((props, ref) => {
  const { data: { id, coord: { x, y, w, h } }, handleUpdateCoord, getModulesData } = props;
  
  // Transform x, y to left, top
  const [{ top, left }, setPosition] = React.useState(() => ({
    top: moduleY2LocalY(y),
    left: moduleX2LocalX(x),
  }));

  // console.log({top, left });


  const dndManager = useDragDropManager();
  const initialPosition = React.useRef<{ top: number; left: number }>();


  // Use request animation frame to process dragging
  const [stop, start] = useRafLoop(() => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();

    if (!initialPosition.current || !movement) {
      return;
    }

  
    const newTop = initialPosition.current.top + movement.y;
    const newLeft = initialPosition.current.left + movement.x;

    setPosition({ top: newTop, left: newLeft });

    handleUpdateCoord(id, { y: Math.round(newTop), x: Math.round(newLeft / moduleW2LocalWidth(1)) });
  }, false);



  const avoidCollision = () => {
    let moduleTop = top;
    let moduleLeft = left;

    const modules = getModulesData();
    const currentModule = { id, coord: { x, y, w, h } };

    const isColliding = (module1: ModuleInterface, module2: ModuleInterface) => {
      return !(
        module1.coord.x + module1.coord.w <= module2.coord.x ||
        module1.coord.x >= module2.coord.x + module2.coord.w ||
        module1.coord.y + module1.coord.h <= module2.coord.y ||
        module1.coord.y >= module2.coord.y + module2.coord.h
      );
    };

    modules.forEach((module) => {
      while (isColliding(currentModule, module)) {
        moduleTop += 40; 

        currentModule.coord.y = Math.round(moduleTop);
      }
    });

    setPosition({ top: moduleTop, left: moduleLeft });

    handleUpdateCoord(id, {
      y: Math.round(moduleTop),
      x: Math.round(moduleLeft / moduleW2LocalWidth(1)),
    });
  };

  // Wire the module to DnD drag system
  const [, drag] = useDrag(() => ({
    type: 'module',
    item: () => {
      // Track the initial position at the beginning of the drag operation
      initialPosition.current = { top, left };

      // Start raf
      start();
      return { id };
    },
    end: () => {
      stop();
      avoidCollision()
    },
  }), [top, left]);

  return (
    <Box
      ref={drag}
      display="flex"
      position="absolute"
      border={1}
      borderColor="grey.500"
      padding="10px"
      bgcolor="rgba(0, 0, 0, 0.5)"
      top={top}
      left={left}
      width={moduleW2LocalWidth(w)}
      height={h}
      sx={{
        transitionProperty: 'top, left',
        transitionDuration: '0.1s',
        '& .resizer': {
          opacity: 0,
        },
        '&:hover .resizer': {
          opacity: 1,
        },
      }}
    >
      <Box
        ref={ref}
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={40}
        color="#fff"
        sx={{ cursor: 'move' }}
        draggable
      >
        <Box sx={{ userSelect: 'none', pointerEvents: 'none' }}>{id}</Box>
      </Box>
    </Box>
  );
});

export default React.memo(Module);
