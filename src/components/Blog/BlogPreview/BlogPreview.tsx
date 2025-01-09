'use client'

import { Editor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'    
import parse from 'html-react-parser'

export const BlogPreview = ({ content }: {content: string }) => {
    

    if(!content) {
        return null;
    }

    return (
        <div className='tiptap'>
            {parse(content)}
        </div>
    );
};