import { memo } from 'react';
import SceneContainer from '../components/SceneContainer';
import fondoHabitacion from '../assets/habitacion.png';

const PERFILES = [
    {
        src: '/perfiles/alexis comleto.png',
        alt: 'Perfil de Alexís Osorio',
    },
    {
        src: '/perfiles/Lopez completo.png',
        alt: 'Perfil de Sofía López',
    },
    {
        src: '/perfiles/Usuga completo.png',
        alt: 'Perfil de Sofía Usuga',
    },
    {
        src: '/perfiles/camila completo.png',
        alt: 'Perfil de Camila Monsalve',
    },
];

function Sotano() {
    return (
        <SceneContainer
            backgroundImage={fondoHabitacion}
            className="sotano-scene"
            showBack={false}
            showMenu={true}
            menuLabel="Menú principal"
            menuClassName="scene-menu-button--sotano"
            menuContent={(
                <svg
                    className="scene-menu-button__icon"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-hidden="true"
                >
                    <path d="M12 3.1 3 10.2v10.7c0 .6.4 1 1 1h5.5v-6.3c0-.6.4-1 1-1h3c.6 0 1 .4 1 1V22h5.5c.6 0 1-.4 1-1V10.2l-9-7.1Zm0 2.6 7 5.5V20h-3.5v-5.3c0-1.7-1.3-3-3-3h-1c-1.7 0-3 1.3-3 3V20H5V11.2l7-5.5Z" />
                </svg>
            )}
        >
            <div className="sotano-gallery" role="region" aria-label="Perfiles">
                {PERFILES.map((perfil) => (
                    <figure className="sotano-profile" key={perfil.src}>
                        <img className="sotano-profile__image" src={perfil.src} alt={perfil.alt} />
                    </figure>
                ))}
            </div>
        </SceneContainer>
    );
}

export default memo(Sotano);
