import React from 'react'
import { Card, CardContent } from './ui/card';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
    return (
        <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
                <div className="rounded-full bg-indigo-500/20 w-12 h-12 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
                <p className="text-neutral-400">{description}</p>
            </CardContent>
        </Card>
    );
};


export default FeatureCard;