const self = module.exports = {

  getFragment: (filePath) => {
    const { readFileSync } = require('fs-extra');
    const path = require('path');
    const projFrag = path.join(filePath);
    console.log(`reading proj frag : ${projFrag}`);
    const file = readFileSync(projFrag);
    return file.toString();
  },

  welcomeFragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments/welcomeFragment.html'));
  },

  footerFragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//footerFragment.html'));
  },

  projectFragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//projectFragment.html'));
  },

  viewProjectCol2Fragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//viewProjectCol2Fragment.html'));
  },

  viewProjectCol9Fragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//viewProjectCol9Fragment.html'));
  },

  viewProjectModalsFragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//viewProjectModalsFragment.html'));
  },

  resultsFragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//resultsFragment.html'));
  },

  resultCol2Fragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//resultCol2Fragment.html'));
  },

  resultCol9Fragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//resultCol9Fragment.html'));
  },

  apiClientCol2Fragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//apiClientCol2Fragment.html'));
  },

  apiClientCol9Fragment: () =>{
    return self.getFragment(require.resolve('./../../html/fragments//apiClientCol9Fragment.html'));
  },
};