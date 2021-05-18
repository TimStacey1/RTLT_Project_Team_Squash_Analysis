import React from 'react';
import AnnotationControls from './AnnotationControls';

export default function AnnotationInterface() {
    return (
        <div className="grid grid-cols-12 grid-rows-4 gap-4 mx-4 h-desktop">
            <div className="col-span-2 row-span-4 h-full bg-blue-500">
                Annotation List goes here
            </div>
            <div className="col-span-7 row-span-3 h-full bg-blue-500">
              Video goes here
            </div>
            <div className="col-span-3 row-span-4 h-full bg-gray-300">
              <AnnotationControls/>
            </div>
            <div className="col-span-7 row-span-1 h-full bg-blue-500">
              Video Controls/Additional Annotation Controls go here
            </div>
        </div>
    );
}