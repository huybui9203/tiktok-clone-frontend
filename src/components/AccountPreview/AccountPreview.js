import { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './AccountPreview.module.scss';
import Button from '~/components/Button';
import Avatar from '~/components/Avatar';

const cx = classNames.bind(styles);

function AccountPreview({ data, onFollow, hideFollowBtn }) {
    console.log('acc render');
    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <Avatar width={'44px'} src={data.avatar?.sm} alt={data.nickname} />
                {hideFollowBtn || (
                    <Button
                        type='button'
                        className={cx('btn')}
                        outlinePrimary={!!data.is_followed}
                        primary={!data.is_followed}
                        onClick={onFollow}
                    >
                        {data.is_followed ? 'Following' : 'Follow'}
                    </Button>
                )}
            </header>

            <div className={cx('body')}>
                <p className={cx('username')}>
                    <strong>{data.username}</strong>
                    {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
                </p>
                <p className={cx('nickname')}>{data.nickname}</p>
                <p className={cx('statistic')}>
                    <strong className={cx('value')}>{data.followers_count}</strong>
                    <span className={cx('label')}>Followers</span>

                    <strong className={cx('value')}>{data.likes_count}</strong>
                    <span className={cx('label')}>Likes</span>
                </p>
            </div>
        </div>
    );
}

AccountPreview.propTypes = {
    data: PropTypes.object.isRequired,
};

export default memo(AccountPreview);
