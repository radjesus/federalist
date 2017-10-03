import React from 'react';
import { SITE, USER } from '../../propTypes';


const SiteUsers = ({ site, user }) => {
  // sort users by lower-cased usernames
  const users = site.users.slice().sort((a, b) => {
    const aName = a.username.toLowerCase();
    const bName = b.username.toLowerCase();
    if (aName === bName) { return 0; }
    if (aName > bName) { return 1; }
    return -1;
  });

  return (
    <div>
      <div className="usa-grid">
          <div className="usa-width-one-whole">
            <p>
              This user table is an incomplete feature. It does not allow you to add or remove users, but instead allows you to easily audit who else has access to Federalist settings for this site.
              New users get access to Federalist by logging into Federalist and adding the site themselves.
            </p>
          </div>
        </div>
      <br/ >
      <h4 className="label">Federalist users associated with this site</h4>
      <table className="usa-table-borderless">
        <thead>
          <tr>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u =>
            (<tr key={u.username}>
              <td>
                <a
                  href={`https://github.com/${u.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit GitHub profile for ${u.username}`}
                >
                  {u.username}
                </a>
                {' '}
                {u.username.toLowerCase() === user.username.toLowerCase() ? '(you)' : ''}
              </td>
            </tr>)
          )}
        </tbody>
      </table>
    </div>
  );
};

SiteUsers.propTypes = {
  site: SITE,
  user: USER,
};

SiteUsers.defaultProps = {
  site: null,
  user: null,
};

export default SiteUsers;
