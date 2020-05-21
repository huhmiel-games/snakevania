/**
 * A Health class helper
 * @param health - The current health value (default to 0)
 * @param maxHealth - The max health value (default to 0)
 * @method getHealth(): number
 * @method setHealth(value: number): number
 * @method substractHealth(value: number): number
 * @method addHealth(value: number): number
 * @method getMaxHealth(): number
 * @method setMaxHealth(value: number): void
 */
export default class Health {
  constructor(health = 0, maxHealth = 0) {
    this.health = health;
    this.maxHealth = maxHealth;
  }

  /**
  *Return the health value
  */
  getHealth() {
    return this.health;
  }

  /**
   * Set the health and return the new health value
   */
  setHealth(value) {
    if (value > 0) {
      this.health = value;
    } else {
      this.health = 0;
    }
    if (this.health < this.maxHealth) {
      return this.health;
    }
    this.health = this.maxHealth;
    return this.health;
  }

  /**
   * Substract value to current health 
   */
  substractHealth(value) {
    return this.setHealth(this.getHealth() - value);
  }

  /**
   * Add value to current health 
   */
  addHealth(value) {
    return this.setHealth(this.getHealth() + value);
  }

  /**
   * Get the maxHealth
   */
  getMaxHealth() {
    return this.maxHealth;
  }

  /**
   * Set the maxHealth
   */
  setMaxHealth(value) {
    this.maxHealth = value;
  }
}