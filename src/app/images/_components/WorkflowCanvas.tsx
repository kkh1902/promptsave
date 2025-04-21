'use client';

import React, { useRef, useEffect } from 'react';

declare global {
  interface Window {
    LiteGraph: any;
    LGraphCanvas: any;
  }
}

interface WorkflowCanvasProps {
  workflowData: object | string | null | undefined;
  className?: string;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ workflowData, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<any>(null);
  const graphCanvasRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !window.LiteGraph || !window.LGraphCanvas) { // workflowData가 없어도 일단 초기화 시도
      console.warn('WorkflowCanvas: Canvas or LiteGraph library not ready.');
      return;
    }

    // workflowData가 없을 경우 캔버스만 렌더링하고 초기화는 건너뛰기
    if (!workflowData) {
        console.log('WorkflowCanvas: No workflow data provided, rendering empty canvas.');
        // 이전 그래프 인스턴스가 있다면 정리
        if (graphCanvasRef.current) {
          graphCanvasRef.current.stop();
          graphCanvasRef.current = null;
        }
        if (graphRef.current) {
            graphRef.current.clear();
            graphRef.current = null;
        }
        return;
    }

    // Prevent re-initialization if graph is already there for the same data (basic check)
    if (graphCanvasRef.current && graphRef.current?.workflow_data_ref === workflowData) { 
        console.log('WorkflowCanvas: Already initialized with the same data.');
        return;
    }

    let parsedData: object;
    if (typeof workflowData === 'string') {
      try {
        parsedData = JSON.parse(workflowData);
      } catch (error) {
        console.error("Failed to parse workflow data:", error);
        return; 
      }
    } else if (typeof workflowData === 'object' && workflowData !== null) {
      parsedData = workflowData;
    } else {
      console.error("Invalid workflow data format:", workflowData);
      return; 
    }

    try {
      // 이전 그래프 정리 (데이터가 변경되었을 수 있음)
      if (graphCanvasRef.current) {
        graphCanvasRef.current.stop();
        graphCanvasRef.current = null;
      }
      if (graphRef.current) {
          graphRef.current.clear();
          graphRef.current = null;
      }
      
      // Initialize LiteGraph
      const graph = new window.LiteGraph.LGraph();
      graphRef.current = graph;
      graphRef.current.workflow_data_ref = workflowData; // 데이터 참조 저장 (재초기화 방지용)

      // Configure graph from data
      graph.configure(parsedData);

      // Initialize LGraphCanvas
      const graphCanvas = new window.LGraphCanvas(canvasRef.current, graph);
      graphCanvasRef.current = graphCanvas;

      // Set to read-only / presentation mode
      graphCanvas.allow_interaction = false;
      graphCanvas.render_execution_order = false;
      graphCanvas.render_connections_border = false;
      graphCanvas.render_collapsed_slots = false; 
      graphCanvas.render_node_details = false;
      graphCanvas.show_info = false;

      // Start rendering
      graphCanvas.start();

      // Fit graph to view
      setTimeout(() => {
        graphCanvas.zoomToFit(true);
      }, 100);

      // Resize handler
      const handleResize = () => {
        graphCanvas.resize();
        graphCanvas.zoomToFit(true); 
      };
      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        console.log('WorkflowCanvas: Cleaning up LiteGraph.');
        window.removeEventListener('resize', handleResize);
        if (graphCanvasRef.current) {
          graphCanvasRef.current.stop();
          graphCanvasRef.current = null; 
        }
        if (graphRef.current) {
            graphRef.current.clear(); 
            graphRef.current = null;
        }
      };
    } catch (error) {
        console.error("Error initializing LiteGraph:", error);
    }

  }, [workflowData]); 

  return (
    <canvas 
      ref={canvasRef} 
      className={className || 'w-full h-[500px] border rounded-md bg-muted/20'} 
      style={{ width: '100%', minHeight: '400px' }} 
    ></canvas>
  );
}; 