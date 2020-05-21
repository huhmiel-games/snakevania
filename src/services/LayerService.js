/**
 * Handle tiled Layers
 */
export default class LayerService {

  /**
   * Return the layer object
   */
  static checkObjectsLayerIndex(scene, layerName) {
    const arr = scene.map.objects.filter((elm) => elm.name === layerName);
    if (!arr || !arr.length) {
      return null;
    }
    return arr[0];
  }

  /**
   * Return the layer
   */
  static checkIfLayerExists(scene, layerName) {
    const arr = scene.map.layers.filter((elm) => elm.name === layerName);
    if (!arr.length) {
      return false;
    }
    return true;
  }

  /**
   * Add the layers
   */
  static addLayers(scene) {
    scene.solLayer = scene.map.createDynamicLayer('collideGround', scene.tileset, 0, 0)
      .setDepth(11);

    scene.backLayer = scene.map.createDynamicLayer('back', scene.tileset, 0, 0)
      .setDepth(4);
   
    scene.frontLayer = scene.map.createDynamicLayer('front', scene.tileset, 0, 0)
      .setDepth(107);
  }
}