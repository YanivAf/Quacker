import React from 'react'
import '../Quacker.scss';

const Loader:React.FC = (): JSX.Element => {
    return (
        <div className='loader-wrapper'>
            <img
                src={"https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png"}
                alt={'Quacker loader'}
                title={'Quacker loader'}
                className="loader" />
            <p>Getting data...</p>
        </div>
    );
}

export default Loader;