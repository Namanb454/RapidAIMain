import React from 'react'
import { Card, CardContent } from './ui/card';

const TestimonialCard = ({ quote, author, role, company }: { quote: string; author: string; role: string; company: string }) => {
    return (
        <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
                <div className="mb-4 text-indigo-400">
                    <svg width="45" height="36" className="fill-current">
                        <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z"></path>
                    </svg>
                </div>
                <p className="text-white mb-6">{quote}</p>
                <div>
                    <p className="font-medium text-white">{author}</p>
                    <p className="text-sm text-neutral-400">{role}, {company}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default TestimonialCard