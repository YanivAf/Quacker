import { useContext } from 'react';
import '../Quacker.scss';

import QuackerContext from './quackerContext';

const ProfileView:React.FC = (): JSX.Element => {
    const context = useContext(QuackerContext);
    const { quacksUserViewed } = context;
    const defaultProfilePicUrl = 'https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png';

    return (
        <main className="Quacker-main profile">
            <h1 className="Quacker-h1">Quacker Profile</h1>
            <img
            alt={`${quacksUserViewed.username}'s profile pic`}
            title={`${quacksUserViewed.username}'s profile pic`}
            src={quacksUserViewed.picUrl ? quacksUserViewed.picUrl : defaultProfilePicUrl}
            className = 'profile-img' />
            <p>{quacksUserViewed.username}</p>
        </main>
    );
}

export default ProfileView;