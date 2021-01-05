'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.author = ctx.state.user.id;
      entity = await strapi.services.review.create(data, { files });
    } else {
      ctx.request.body.author = ctx.state.user.id;
      entity = await strapi.services.review.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.review });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [review] = await strapi.services.review.find({
      id: ctx.params.id,
      'author.id': ctx.state.user.id,
    });

    if (!review) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.review.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.review.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.review });
  },

  /**
   * Delete a record.
   *
   * @return {Object}
   */

  async delete(ctx) {
    const { id } = ctx.params;

    let entity;

    const [review] = await strapi.services.review.find({
      id: ctx.params.id,
      'author.id': ctx.state.user.id,
    });

    if (!review) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.review.delete({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.review.delete({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.review });
  },
};
