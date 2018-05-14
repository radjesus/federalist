import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import DownloadBuildLogsButton from '../../../../frontend/components/site/downloadBuildLogsButton';

const fetchBuildLogs = spy();

describe('<DownloadBuildLogsButton />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<DownloadBuildLogsButton buildId={123} buildLogsData= {[]} />);
    expect(wrapper.find('button')).to.have.length(1);
    expect(wrapper.find('button').contains('Download logs')).to.be.true;
  });
});
