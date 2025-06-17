import React from 'react';
import { FiType, FiCornerDownLeft, FiCornerUpRight, FiTrash2 } from 'react-icons/fi';

function MainMenu({ onAddText, onUndo, onRedo, onDelete }) {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t py-2 z-50">
            <div className="flex justify-around items-center">
                {/* Ajouter Texte */}
                <button onClick={onAddText} className="flex flex-col items-center">
                    <FiType className="text-xl" />
                    <span className="text-xs">Ajouter texte</span>
                </button>

                {/* Annuler */}
                <button onClick={onUndo} className="flex flex-col items-center">
                    <FiCornerDownLeft className="text-xl" />
                    <span className="text-xs">Annuler</span>
                </button>

                {/* Rétablir */}
                <button onClick={onRedo} className="flex flex-col items-center">
                    <FiCornerUpRight className="text-xl" />
                    <span className="text-xs">Rétablir</span>
                </button>

                {/* Supprimer */}
                <button onClick={onDelete} className="flex flex-col items-center">
                    <FiTrash2 className="text-xl" />
                    <span className="text-xs">Supprimer</span>
                </button>
            </div>
        </div>
    );
}

export default MainMenu;
