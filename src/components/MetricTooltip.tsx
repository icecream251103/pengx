import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface MetricTooltipProps {
  children: ReactNode;
  title: string;
  description: string;
  formula?: string;
  example?: string;
}

const MetricTooltip: React.FC<MetricTooltipProps> = ({ 
  children, 
  title, 
  description, 
  formula, 
  example 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'right' | 'left' | 'top' | 'bottom'>('right');
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && containerRef.current && tooltipRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Determine best position
      let bestPosition: 'right' | 'left' | 'top' | 'bottom' = 'right';

      // Check if there's space on the right
      if (container.right + tooltip.width + 10 > viewport.width) {
        // Check if there's space on the left
        if (container.left - tooltip.width - 10 > 0) {
          bestPosition = 'left';
        } else {
          // Use top or bottom
          bestPosition = container.top - tooltip.height - 10 > 0 ? 'top' : 'bottom';
        }
      }

      setPosition(bestPosition);
    }
  }, [isVisible]);

  const getTooltipPositionClasses = () => {
    const baseClasses = "absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80";
    
    switch (position) {
      case 'right':
        return `${baseClasses} -top-2 left-full ml-2`;
      case 'left':
        return `${baseClasses} -top-2 right-full mr-2`;
      case 'top':
        return `${baseClasses} bottom-full mb-2 left-1/2 transform -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} top-full mt-2 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} -top-2 left-full ml-2`;
    }
  };

  const getArrowClasses = () => {
    const arrowSize = "w-0 h-0 border-8";
    
    switch (position) {
      case 'right':
        return `absolute left-0 top-4 ${arrowSize} border-t-transparent border-b-transparent border-l-transparent border-r-white dark:border-r-gray-800 -ml-2`;
      case 'left':
        return `absolute right-0 top-4 ${arrowSize} border-t-transparent border-b-transparent border-r-transparent border-l-white dark:border-l-gray-800 -mr-2`;
      case 'top':
        return `absolute top-full left-1/2 transform -translate-x-1/2 ${arrowSize} border-l-transparent border-r-transparent border-b-transparent border-t-white dark:border-t-gray-800 -mt-2`;
      case 'bottom':
        return `absolute bottom-full left-1/2 transform -translate-x-1/2 ${arrowSize} border-l-transparent border-r-transparent border-t-transparent border-b-white dark:border-b-gray-800 -mb-2`;
      default:
        return `absolute left-0 top-4 ${arrowSize} border-t-transparent border-b-transparent border-l-transparent border-r-white dark:border-r-gray-800 -ml-2`;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={getTooltipPositionClasses()}
        >
          {/* Arrow */}
          <div className={getArrowClasses()}></div>
          
          <div className="flex items-start space-x-2 mb-3">
            <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded flex-shrink-0">
              <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </h4>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
            {description}
          </p>
          
          {formula && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Công thức:
              </p>
              <code className="text-xs bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200 block break-words">
                {formula}
              </code>
            </div>
          )}
          
          {example && (
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ví dụ:
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
                {example}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricTooltip;
